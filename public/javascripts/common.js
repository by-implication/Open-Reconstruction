var common = {};

common.dropzonePreviewTemplate = m(".dz-preview.dz-file-preview", [
  m(".dz-details", [
    m("img", {"data-dz-thumbnail": true}),
    m(".dz-filename", [
      m("span", {"data-dz-name": true}),
    ]),
    m(".dz-size", {"data-dz-size": true}),
  ]),
  m(".dz-progress", [
    m("span.dz-upload", {"data-dz-uploadprogress": true}),
  ]),
  m(".dz-error-message", [
    m("span", {"data-dz-errormessage": true})
  ]),
]);

common.stagnation = function(reqCtrl, offset){

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
    current = new Date(req.now).getTime();
  }

  var dd = current + offset - timestamp;
  // var ms = helper.pad(Math.floor((dd%1000)/10));
  dd/=1000;
  var s = helper.pad(Math.floor(dd%60));
  dd/=60;
  var m = helper.pad(Math.floor(dd%60));
  dd/=60;
  var h = helper.pad(Math.floor(dd%24));
  dd/=24;
  var d = Math.floor(dd);
  return d + " DAYS " + h + ":" + m + ":" + s;
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

common.field = function(name, content, help, outsideLabel){

  var label = m("div.row", [
    m("div.columns.medium-12", name)
  ]);
  
  var contents = m("div.row", [
    m("div.columns.medium-12", [
      content
    ]),
    // m("div.columns.medium-4.help-container", [
    //   m("p.help", help)
    // ])
  ]);

  if(outsideLabel){
    return m("div", [
      m("label", [label]),
      contents
    ]);
  } else {
    return m("label", [
      label,
      help ? 
        m("div.help", help)
      : "",
      contents
    ]);
  }
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

common.stickyTabs = {};

common.stickyTabs.menu = function(ctrl, options){
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
      var options = { 
        href: tab.href, 
        onclick: function(e){
          e.preventDefault();
          $("html, body").animate({scrollTop: $(tab.href).position().top + "px"});
        }
      };
      return m("dd", {class: (location.hash === tab.href) ? "active" : ""}, [
        m("a", options, tab.label())
      ]);
    })
  )
}

common.stickyTabs.controller = function(){
  this.tabs = m.prop([]);
}

common.stickyTabs.locHandler = function(hash){
  if(history.replaceState) { 
    history.replaceState({}, "", hash);
  } else { 
    scrollV = document.body.scrollTop;
    scrollH = document.body.scrollLeft;
    location.hash = hash;
    document.body.scrollTop = scrollV;
    document.body.scrollLeft = scrollH;
  }
}

common.stickyTabs.config = function(ctrl){
  return function(elem, isInit){
    setTimeout(function(){
      if (!isInit){
        idPosDict = _.chain(ctrl.tabs())
          .map(function(t){
            var item = t.href;
            // console.log($(item).position().top, $(item).height());
            return [$(item).position().top + $(item).height(), item];
          })
          .object()
          .value();

        var poss = _.keys(idPosDict);
        var windowPos = $(window).scrollTop();
        var closestPos = _.find(poss, function(p){ return p >= windowPos });

        $(window).on("scroll", function(e){
          var windowPos = $(window).scrollTop();
          var closestPos = _.find(poss, function(p){
            return p >= windowPos
          });
          var hash = idPosDict[closestPos];
          if ((location.hash != hash)){
            // console.log(hash);
            m.startComputation();
            common.stickyTabs.locHandler(hash);
            m.endComputation();
          }
        });
      }
    }, 100)
    common.sticky.config(ctrl)(elem, isInit);
  }
}

common.sticky = {};
common.sticky.config = function(ctrl){
  return function(elem, isInit){
    var maxScrollRange = function(){
      var parent = $(elem).parent();
      return parent.height() + parent.position().top - $(elem).height();
    }
    var initialTop = function(elem){
      var offset = parseInt($(elem).css("top")) || 0;
      return $(elem).position().top - offset;
    }
    var adjustLayout = function(){
      var scrollTop = $(window).scrollTop()
      var top = 0;
      if (scrollTop > initialTop(elem)) {
        top = Math.min(scrollTop, maxScrollRange()) - initialTop(elem);
      }
      $(elem).css("top", top);
    }
    var posType = $(elem).css("position");
    if (posType != "relative") {
      $(elem).css("position", "relative")
    };
    if(!isInit){
      $(window).on("scroll", function(e){
        adjustLayout();
      });
    }
  }
}

common.modal = {};
common.modal.controller = function(){
  this.isVisible = m.prop(false);
  this.show = function(){
    this.isVisible(true);
    this.height = helper.docHeight;
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

common.pagination = function(pageNum, pageCount, p2link){

  var adjacentPages = 3;
  var displayedPages = 1 + 2 * adjacentPages + 2 + 2;
  var allowance = 1 + 2 + adjacentPages;
  var pagesToDisplay = function() {
    var pages = [];
    if(pageCount <= displayedPages) {
      pages = _.range(1, pageCount+1);
    }
    else {
      pages.push(1);
      if(pageNum <= allowance) {
        pages = pages.concat(_.range(2, displayedPages - 2));
        pages.push("...");
      }
      else if(pageNum <= pageCount - allowance) {
        pages.push("...");
        pages = pages.concat(_.range(pageNum - adjacentPages, pageNum + adjacentPages + 1));
        pages.push("...");
      }
      else {
        pages.push("...");
        pages = pages.concat(_.range(pageCount - displayedPages + 3, pageCount));
      }
      pages.push(pageCount);
    }
    return pages;
  }

  return m("ul.pagination", [
    m("li.arrow",{className: pageNum === 0 ? "unavailable" : ""}, [
      m("a", {
        href: p2link(Math.max(pageNum - 1, 1)),
        config: m.route
      }, [
        "«"
      ]),
    ]),
    _.chain(pagesToDisplay())
      .map(function (page){
        if(page == "...") {
          return m("li.unavailable", m("a", "..."));
        }
        else {
          return m("li", {className: page === pageNum ? "current" : ""}, [
            m("a", {
              href: p2link(page),
              config: m.route
            }, page)
          ])
        }
      })
      .value(),
    m("li.arrow",{className: pageNum === pageCount ? "unavailable" : ""}, [
      m("a", {
        href: p2link(Math.min(pageNum + 1, pageCount)),
        config: m.route
      },[
        "»"
      ]),
    ]),
  ])
}

common.leaflet = {

  _map: null,
  markers: [],

  map: function(elem){

    if(this._map) this._map.remove();
    var map = L.map(elem, {scrollWheelZoom: false}).setView([11.3333, 123.0167], 5);
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 19, attribution: osmAttrib}).addTo(map);
    return this._map = map;

  },

  addMarker: function(coords, noClear){
    if(!noClear) this.clearMarkers()
    this.markers.push(L.marker(coords).addTo(this._map));
  },

  clearMarkers: function(){
    this.markers.forEach(function (m){
      this._map.removeLayer(m);
    }.bind(this));
  },

  addPopup: function(coords, content){
    if(this._map){
      L.popup()
        .setLatLng(coords)
        .setContent(content)
        .openOn(this._map);
    } else {
      setTimeout(function(){
        this.addPopup(coords, content);
      }.bind(this), 100);
    }
  }

}

common.formErrorHandler = function(r){
  if(r.reason == "form error"){
    var msg = "Form submission failed because of the following:";
    for(var field in r.messages){
      var message = r.messages[field];
      msg += "\n" + field + " - " + message;
    }
    alert(msg);
  } else {
    alert(r.reason);
  }
}

common.dateField = function(label, timestampProp, htmlProp){
  return common.field(
    label,
    m("input", {type: "date", value: htmlProp(), onchange: m.withAttr("value", function (v){
      htmlProp(v);
      timestampProp((new Date(v)).getTime());
    })})
  );
}