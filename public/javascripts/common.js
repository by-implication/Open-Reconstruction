var common = {};

common.attachmentActions = function(attachment){
  return [
    m("a", {title: "Preview", href: "/attachments/" + attachment.id + "/preview", target: "_blank"}, [
      m("i.fa.fa-lg.fa-fw.fa-eye"),
    ]),
    m("a", {title: "Download", href: "/attachments/" + attachment.id + "/download"}, [
      m("i.fa.fa-lg.fa-fw.fa-download"),
    ]),
    this.canEdit() ? attachment.isArchived ?
      m("a", {title: "Unarchive", onclick: function(){
        m.request({method: "POST", url: "/attachments/" + attachment.id + "/unarchive"}).then(function (r){
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
        m.request({method: "POST", url: "/attachments/" + attachment.id + "/archive"}).then(function (r){
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

common.tabs.view = function(ctrl, options){
  if(!options){
    options = {};
  }

  return m("dl.tabs[data-tab]", options, [
    ctrl.tabs().map(function(item, i){
      var setActive = function(item){
        if(ctrl.isActive(item.label)){
          return "active";
        } else {
          return "";
        }
      };
      return m("dd", {class: setActive(item)}, [
        m("a", { href: ctrl.absolute(item.href), config: m.route }, item.label)
      ]);
    })
  ])
}

common.tabs.controller = function(basePath){
  var absolute = this.absolute = function(href) {
    return basePath + '/' + href;
  }
  this.tabs = m.prop([]);
  this.currentTab = function() {
    var item = _.find(this.tabs(), function(tab) { return absolute(tab.href) == m.route.path });
    if(item == undefined) {
      item = _.head(this.tabs());
    }
    return item.label;
  }
  this.isActive = function(label){
    return this.currentTab() == label;
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
}
common.modal.view = function(ctrl, temp){
  if (ctrl.isVisible()) {
    return m("section.modal", {style: {height: ctrl.height()+"px"}}, [
      m(".curtain", {onclick: ctrl.close.bind(ctrl)}),
      m(".row", [
        m(".columns.medium-6.medium-centered.dialog", [
          m(".card", [
            m("form", {onsubmit: ctrl.signoff}, [
              m(".section", [
                m("h3", "Authorization Required"),
                m("p", [
                  "Please enter your password to continue."
                ]),
              ]),
              m("hr"),
              m(".section", [
                common.field("Password", m("input[type='password']", {
                  onchange: m.withAttr("value", ctrl.password)
                })),
                m("button", [
                  "Submit"
                ]),
              ]),
            ])
          ]),
        ]),
      ]),
      // m(".dialog", [
      //   m(".row", [
          
      //   ]),
      // ]),
    ])
  } else {
    return ""
  }
}

// common.tabs.panes = function(ctrl, views){
//   if(!ctrl.currentTab()){
//     ctrl.currentTab(_.keys(views)[0]);
//   }
//   return views[ctrl.currentTab()];
// }

