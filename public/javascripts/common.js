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
      m("div.columns.medium-2", [
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
    ctrl.tabs().filter(function(item){
      return item.when ? item.when() : true;
    })
    .map(function(item, i){
      var activeTab = function(i){
        if(ctrl.isActive(item.label, i)){
          return "active";
        } else {
          return "";
        }
      };
      return m("dd", {class: activeTab(i)}, [
        m("a", {onclick: function(){
          ctrl.currentTab(item.label);
        }}, item.label)
      ]);
    })
  ])
}

common.tabs.controller = function(){
  this.currentTab = m.prop();
  this.tabs = m.prop([]);
  this.isActive = function(label, index){
    if(!this.currentTab()){
      return index == 0
    } else {
      return this.currentTab() === label
    }
  }
}

// common.tabs.panes = function(ctrl, views){
//   if(!ctrl.currentTab()){
//     ctrl.currentTab(_.keys(views)[0]);
//   }
//   return views[ctrl.currentTab()];
// }

common.renderString = function(str){
  if(str){
    return m("span", str);
  } else {
    return m("span.label.alert", "Missing Data");
  }
}

common.renderObj = function(obj){
  if(_.isEmpty(obj)){
    return m("span.label.alert", "Missing Data");
  } else {
    return _.chain(obj)
      .pairs()
      .filter(function(entry){
        return entry[1];
      })
      .map(function(entry){
        return m("div", [m("h5", entry[0]), m("p", entry[1])]);
      })
      .value();
  }
}