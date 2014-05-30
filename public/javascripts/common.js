var common = {};

common.stagnation = function(reqCtrl){

  function getDateRejected(history){
    var rejection = history.filter(function (h){
      return h.kind == "reject";
    })[0];
    return new Date(rejection.date);
  }

  function getDateApproved(history){
    var approval = history.filter(function (h){
      return h.kind == "signoff" && h.govUnit.name == "Office of the President";
    })[0];
    return new Date(approval.date);
  }

  var req = reqCtrl.request();
  var timestamp = req.date;

  var current;
  if(req.isRejected){
    current = getDateRejected(reqCtrl.history());
  } else if(req.level > 3){
    current = getDateApproved(reqCtrl.history());
  } else {
    current = new Date();
  }

  var dd = current - timestamp;
  var ms = helper.pad(Math.floor((dd%1000)/10));
  dd/=1000;
  var s = helper.pad(Math.floor(dd%60));
  dd/=60;
  var m = helper.pad(Math.floor(dd%60));
  dd/=60;
  var h = helper.pad(Math.floor(dd%24));
  dd/=24;
  var d = Math.floor(dd);
  return d + " DAYS " + h + ":" + m + ":" + s + "." + ms;
}

common.duration = function(ms){
  var cur = ms / 1000;
  var next = cur / 60;
  var r;
  if(next < 1){
    r = [cur, "seconds"];
  } else {
    cur = next;
    next /= 60;
    if(next < 1){
      r = [cur, "minutes"];
    } else {
      cur = next;
      next /= 60;
      if(next < 1){
        r = [cur, "hours"];
      } else {
        r = [next, "days"];
      }
    }
  }
  return r[0].toFixed(2) + " " + r[1];
}
common.day = function(ms){
  var threshold = 5;
  var day = Math.floor(ms / 86400000);
  var rating = "";
  if (day > threshold) {
    rating = "alert";
  }

  var wording = ""
  switch(day){
    case 0:
      wording = "new";
      break;
    case 1:
      wording = "1 day";
      break;
    default:
      wording = day + " days";
      break;
  }
  return m("span.age", {className: rating}, [
    wording,
    day > threshold ?
      m("span", [
        " ",
        m("i.fa.fa-warning")
      ])
    : ""
  ]);
}

common.attachmentActions = function(attachment){
  return [
    m("a", {title: "Preview", href: routes.controllers.Attachments.preview(attachment.id).url, target: "_blank"}, [
      m("i.fa.fa-lg.fa-fw.fa-eye"),
    ]),
    m("a", {title: "Download", href: routes.controllers.Attachments.download(attachment.id).url}, [
      m("i.fa.fa-lg.fa-fw.fa-download"),
    ]),
    this.canEdit() ? attachment.isArchived ?
      m("a", {title: "Unarchive", onclick: function(){
        bi.ajax(routes.controllers.Attachments.unarchive(attachment.id)).then(function (r){
          alert("Succesfully unarchived document.");
          this.attachments().docs.push(r.doc);
          this.history(this.history().filter(function (e){
            var attachmentId = e.content.split(" ").pop();
            return !(e.kind == 'archiveAttachment' && attachmentId == attachment.id);
          }));
        }.bind(this))
      }.bind(this) }, [
        m("i.fa.fa-lg.fa-fw.fa-upload")
      ]) : m("a", {title: "Archive", onclick: function(){
        bi.ajax(routes.controllers.Attachments.archive(attachment.id)).then(function (r){
          alert("Succesfully archived document.");
          var docs = this.attachments().docs;
          docs.splice(docs.indexOf(attachment), 1);
          this.history().unshift(r.event);
        }.bind(this))
      }.bind(this) }, [
        m("i.fa.fa-lg.fa-fw.fa-archive")
      ]) : ""
  ];
}

common.displayDate = function(timestamp){
  return new Date(timestamp).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"});
}

common.banner = function(text){
  return m("section.banner", [
    m("div", {class:"row"}, [
      m("div", {class: "columns medium-12"}, [
        m("h1", text)
      ])
    ])
  ]);
}

common.field = function(name, content, help){
  return m("label", [
    m("div.row", [
      m("div.columns.medium-12", name)
    ]),
    m("div.row", [
      m("div.columns.medium-8", [
        content
      ]),
      m("div.columns.medium-4.help-container", [
        m("p.help", help)
      ])
    ])
  ])
}

common.formSection = function(icon, content, i){
  var alternate = function(i){
    if(i % 2 == 1){
      return "alt";
    } else {
      return "";
    }
  }
  return m("section", {"class": alternate(i)}, [
    m("div.row", [
      m("div.columns.medium-2.field-icon", [
        m("i.fa.fa-5x.fa-fw", {"class": icon})
      ]),
      m("div.columns.medium-10", content)
      // m("div.columns.medium-3", [m("p", help)])
    ])
  ])
}

common.tabs = {};

common.tabs.menu = function(ctrl, options){
  return m("dl.tabs[data-tab]", options || {},
    ctrl.tabs()
    .filter(function (tab){
      if(tab.when){
        return tab.when()
      } else {
        return true
      }
    })
    .map(function (tab, i){
      var tabClass = function(tab){
        if(ctrl.isActive((tab.identifier ? tab.identifier : tab.label()))){
          return "active";
        } else {
          return "";
        }
      };
      var options = { href: tab.href };
      if(tab.href.charAt(0) != '#') {
        options.config = m.route;
      }
      return m("dd", {class: tabClass(tab)}, [
        m("a", options, tab.label())
      ]);
    })
  )
}

common.tabs.content = function(ctrl){
  return ctrl.tabs().filter(function (tab){
    return ctrl.isActive(tab.identifier? tab.identifier : tab.label())
  }).map(function (activeTab){
    return activeTab.content()
  })
}

common.tabs.controller = function(basePath){
  this.tabs = m.prop([]);
  this.currentTab = function() {
    var item = _.find(this.tabs(), function(tab) {
      if(window.location.hash){
        return tab.href === window.location.hash;
      } else {
        return tab.href == m.route() 
      }
    });
    if(item == undefined) {
      item = _.head(this.tabs());
    }
    return item.identifier ? item.identifier : item.label();
  }
  this.isActive = function(identifier){
    return this.currentTab() == identifier;
  }
}

common.modal = {};
common.modal.controller = function(){
  this.isVisible = m.prop(false);
  this.show = function(){
    this.isVisible(true);
    this.height = helper.docHeight;
    // console.log($("html, body"));
    // $("html, body").animate({ scrollTop: "0px" });
  }
  this.close = function(){
    this.isVisible(false);
  }
  this.password = m.prop("");
  this.content = m.prop("");
  this.config = function(elem){
    window.setTimeout(function(){
      elem.style.opacity = 1;
    }, 0); 
  }
  this.dialogConfig = function(elem){
    window.setTimeout(function(){
      var scrollPos = $(window).scrollTop();
      elem.style.top = scrollPos + "px";
    }, 0); 
  }
}
common.modal.view = function(ctrl, content){
  if (ctrl.isVisible()) {
    return m("section.modal", {style: {height: ctrl.height()+"px"}, config: ctrl.config}, [
      m(".curtain", {onclick: ctrl.close.bind(ctrl)}),
      m(".row", [
        m(".columns.medium-6.medium-centered.dialog", {config: ctrl.dialogConfig}, [
          m(".card", [
            content(ctrl)
          ]),
        ]),
      ]),
    ])
  } else {
    return ""
  }
}
