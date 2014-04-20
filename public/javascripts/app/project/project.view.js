project.view = function(ctrl){
  var renderErrorList = function(errList){
    if(errList.length){
      return m("span", [
        m("small", "With errors: "),
        errList.map(function(e){
          return m("span.label.alert", e);
        })
      ])
    }
  }

  var userActions = function(ctrl){

    var actions = m.prop({
      "Comment": [
        m("h3", "Leave a comment"),
        m("textarea"),
        m("button", "Submit")
      ],
      "Approve": [
        m("h3", "Approve"),
        m("div", "insert amount revision"),
        m("div", "insert remarks"),
        m("button", "Approve")
      ],
      "Reject": [
        m("h3", "Reject"),
        m("div", "insert remakrs"),
        m("button", "Reject")
      ]
    })
    return m("div", [
      common.tabs.view(ctrl.tabs, [
        {label: "Comment"},
        {label: "Approve"},
        {label: "Reject"}
      ]),
      m("form", actions()[ctrl.tabs.currentTab() ? ctrl.tabs.currentTab() : "Comment"])
    ])
  }

  return app.template(ctrl.app, {class: "detail"}, [
    ctrl.canSignoff() ?
      m("section.approval", [
        m(".row", [
          m(".columns.medium-12", [
            m("div", [
              m("h4", [
                "Sign off on this request only if you feel the information is complete for your step in the approval process."
              ]),
              m("button", {onclick: ctrl.signoff}, [
                m("i.fa.fa-check"),
              ]),
              m("button.alert", [
                m("i.fa.fa-times"),
              ]),
            ]),
          ]),
        ])
      ])
    : null,
    m("section", [
      m(".row", [
        m(".columns.medium-4", [
          m(".project-stub", [
            m(".section.type", [
              ctrl.project().projectType
            ]),
            m(".section", [
              m("h4", ctrl.project().description),
              m("p.meta", [
                "Posted by ",
                m("a",{href: "/users/"+ctrl.project().authorId, config: m.route}, ctrl.author().name),
                m("br"),
                " on "+(new Date(ctrl.project().date).toString()), // change this as people modify this. "Last edited by _____"
              ]),
            ]),
            m("hr"),
            m("div.section", [
              m("h5", [m("small", "Amount")]),
              m("h5.value", [
                common.renderString(
                  helper.commaize(ctrl.project().amount)
                )
              ]),
              m("h5", [m("small", "Disaster")]),
              m("h5.value", [
                common.renderString(ctrl.project().disasterType + " " + ctrl.project().disasterName + " in " + common.displayDate(ctrl.project().disasterDate))
              ]),
              m("h5", [m("small", "Location")]),
              m("h5.value", [
                common.renderString(ctrl.project().location)
              ])
            ]),
            m(".map-container", [
              m("#detailMap", {config: ctrl.initMap}),
              ctrl.coords() ?
                null
              : m(".map-shroud", [
                  m("h3", [
                    "Map unavailable because requester did not supply coordinates"
                  ]),
                ])
            ]),
          ])
        ]),
        m("div.columns.medium-8", [
          m(".card", [
            m(".section", [
              common.tabs.view(ctrl.projectTabs)
            ]),
            m.switch(ctrl.projectTabs.currentTab())
              .case("Assignments", function(){
                if(ctrl.app.isSuperAdmin()){
                  return m(".section", [
                    m("form", [
                      m("label", [
                        "Assessing Agency",
                        m("select", {onchange: m.withAttr("value", ctrl.updateAssessingAgency), value: ctrl.input.assessingAgency()}, 
                          [m("option", {value: 0}, "None")]
                          .concat(ctrl.assessingAgencies().map(function(agency){
                            return m("option", {value: agency.id, selected: ctrl.input.assessingAgency() == agency.id}, agency.name)
                          }
                        ))),
                        m("p.help", [
                          "The Assessing Agency you assign will independently validate and assess the suitability of this request for execution. They will be the ones making the program of works, etc... If you are unsure about who to assign, it's generally best to assign DPWH."
                        ]),
                      ]),
                      m("label", [
                        "Implementing Agency",
                        m("select", {onchange: m.withAttr("value", ctrl.updateImplementingAgency), value: ctrl.input.implementingAgency()},
                          [m("option", {value: 0}, "None")]
                          .concat(ctrl.implementingAgencies().map(function(agency){
                            return m("option", {value: agency.id, selected: ctrl.input.implementingAgency() == agency.id}, agency.name)
                          }
                          ))),
                        m("p.help", [
                          "The Implementing Agency will be responsible for the handling the money, and the completion of the project. Most of the time the Assessing Agency and the Implementing Agency are the same, but there are some cases wherein they are different. e.g. A school should probably be assessed by the DPWH, but DepEd should handle implementation."
                        ]),
                      ]),
                    ]),
                  ])
                } else {
                  return m(".section", [
                    m("p", [
                      "Assessing Agency",
                      m("h4", [
                        ctrl.assessingAgency() ?
                          m("a", {href: "/agencies/"+ctrl.assessingAgency().id, config: m.route}, [
                            ctrl.assessingAgency().name
                          ])
                        : "Unassigned"
                      ]),
                      m("p.help", [
                        "The Assessing Agency will independently validate and assess the suitability of this request for execution. They will be the ones making the program of works, etc..."
                      ]),
                    ]),
                    m("p", [
                      "Implementing Agency",
                      m("h4", [
                        ctrl.implementingAgency() ?
                          m("a", {href: "/agencies/"+ctrl.implementingAgency().id, config: m.route}, [
                            ctrl.implementingAgency().name
                          ])
                        : "Unassigned"
                      ]),
                      m("p.help", [
                        "The Implementing Agency will be responsible for the handling the money, and the completion of the project. Most of the time the Assessing Agency and the Implementing Agency are the same, but there are some cases wherein they are different. e.g. A school should probably be assessed by the DPWH, but DepEd should handle implementation."
                      ]),
                    ]),
                  ])
                }
              })
              .case("Images", function(){
                return m(".section", [
                  ctrl.app.isAuthorized(3)?
                    m("div#imageDropzone.dropzone", {config: ctrl.initImageDropzone})
                  : null,
                  m("ul.attachments-images.small-block-grid-4", ctrl.attachments().imgs.map(function (img){
                    return m("li", [
                      m("img", {src: "/attachments/" + img.id + "/thumb"}),
                      m(".filename", [
                        m("a", {title: "Preview", href: "/attachments/" + img.id + "/preview", target: "_blank"}, [
                          img.filename
                        ]),
                      ]),
                      
                      m(".uploader", [
                        "Uploaded by ",
                        m("a", {href: "/users/" + img.uploader.id ,config: m.route},[
                          img.uploader.name
                        ]),
                        m(".date", [
                          helper.timeago(new Date(img.dateUploaded)),
                        ]),
                      ]),
                      console.log(img)
                    ]);
                  }))
                ])
              })
              .case("Documents", function(){
                return m(".section", [
                  ctrl.app.isAuthorized(3)?
                    m("div.dropzone", {config: ctrl.initDocDropzone})
                  : null,
                  m("table.doc-list", [
                    m("thead", [
                      m("tr", [
                        m("td", "Filename"),
                        m("td", "Date Uploaded"),
                        m("td", "Uploader"),
                        m("td", "Actions")
                      ])
                    ]),
                    m("tbody", [
                      ctrl.attachments().docs.map(function (doc){
                        return m("tr", [
                          m("td", doc.filename),
                          m("td", common.displayDate(doc.dateUploaded)),
                          m("td", [
                            m("a", {href: "/users/" + doc.uploader.id}, doc.uploader.name)
                          ]),
                          m("td", [
                            m("a", {title: "Preview", href: "/attachments/" + doc.id + "/preview", target: "_blank"}, [
                              m("i.fa.fa-lg.fa-eye.fa-fw"),
                            ]),
                            m("a", {title: "Download", href: "/attachments/" + doc.id + "/download"}, [
                              m("i.fa.fa-lg.fa-download.fa-fw"),
                            ]),
                          ])
                        ])
                      })
                    ])
                  ]),
                ])
              })
              .case("Activity", function(){
                return m(".section", ctrl.history().map(function (e){
                  return historyEvent[e.kind](e);
                }).concat([
                  historyEvent.calamity(ctrl.oldProject().disaster()),
                  ctrl.oldProject().history().map(function(entry){
                    return historyEvent.project(entry);
                  }),
                  ctrl.history()
                ]))
              })
              .render()
          ]),
        ])
      ])
    ]),
  ])
}

project.listView = function(ctrl){
  return m("table", [
    m("thead", [
      m("tr", [
        m("th", "id"),
        m("th", "name"),
        m("th", "dep"),
        m("th.text-right", "amount")
      ])
    ]),
    m("tbody", [
      _.chain(ctrl.projectList)
      .filter(function(p){
        if(!ctrl.currentFilter.projects()){
          return true;
        } else {
          return p.projectType == ctrl.currentFilter.projects();
        }
      })
      .filter(function(p){
        return (p.canSignoff || ctrl.tabs.currentTab() != "Assigned to Me")
      })
      .sortBy(function(p){
        return p.date;
      })
      .map(function(project){
        var url = "/projects/"+project.id;
        return m("tr", [
          m("td", project.id),
          m("td", [
            m("a.name", {href: url, config: m.route}, project.description)
          ]),
          m("td", [
            project.author.agency ? project.author.agency: null
          ]),
          m("td.text-right", helper.commaize(project.amount.toFixed(2)))
        ])
      })
      .value()
    ])
  ])
}
