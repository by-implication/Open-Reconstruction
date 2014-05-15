request.view = function(ctrl){

  return app.template(
    ctrl.app, 
    {class: "detail"}, 
    [ // modals
      common.modal.view(
        ctrl.signoffModal,
        function(ctrl){
          return m("form", {onsubmit: ctrl.signoff}, [
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
        }
      ),
      common.modal.view(
        ctrl.rejectModal,
        function(ctrl){
          return m("form", {onsubmit: ctrl.reject}, [
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
              common.field("Remarks", m("textarea", {
                onchange: m.withAttr("value", ctrl.content)
              }), "Please state the reason for rejection"),
              m("button", [
                "Submit"
              ]),
            ]),
          ])
        }
      )
    ], 
    [ 
      // approval section
      ctrl.isInvolved() ? request.approval(ctrl) : "",
      // progress tracker
      request.progress(ctrl),
      // actual content
      m("section", [
        m(".row", [
          m(".columns.medium-4", [
            request.summary(ctrl)
          ]),
          m("div.columns.medium-8", [
            m(".card", [
              m(".section", [
                common.tabs.menu(ctrl.requestTabs)
              ]),
              m.switch(ctrl.requestTabs.currentTab()())
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
                            "The Implementing Agency will be responsible for the handling the money, and the completion of the request. Most of the time the Assessing Agency and the Implementing Agency are the same, but there are some cases wherein they are different. e.g. A school should probably be assessed by the DPWH, but DepEd should handle implementation."
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
                          "The Implementing Agency will be responsible for the handling the money, and the completion of the request. Most of the time the Assessing Agency and the Implementing Agency are the same, but there are some cases wherein they are different. e.g. A school should probably be assessed by the DPWH, but DepEd should handle implementation."
                        ]),
                      ]),
                    ])
                  }
                })
                .case("Images", function(){
                  return m(".section", [
                    ctrl.curUserCanUpload() ?
                      m("div#imageDropzone.dropzone", {config: ctrl.initImageDropzone})
                    : "",

                    ctrl.attachments().imgs.length ?
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
                          ])
                        ]);
                      }))
                    : m("h3.empty", [
                        "No images have been uploaded yet."
                      ])
                  ])
                })
                .case("Documents", function(){
                  return m(".section", [
                    ctrl.curUserCanUpload() ?
                      m("div.dropzone", {config: ctrl.initDocDropzone})
                    : "",

                    ctrl.attachments().docs.length ?
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
                              m("td", common.attachmentActions.bind(ctrl)(doc))
                            ])
                          })
                        ])
                      ])
                    : m("h3.empty", [
                        "No documents have been uploaded yet."
                      ])
                  ])
                })
                .case("Activity", function(){
                  return m("div", [
                    m(".section", ctrl.history().map(function (e){
                      return historyEvent[e.kind].bind(ctrl)(e);
                    })
                    .reverse()
                    ),
                    ctrl.app.currentUser() ? m("hr") : "",
                    ctrl.app.currentUser() ?
                      m(".section", [
                        m(".event", [
                          m("form.details", {onsubmit: ctrl.submitComment}, [
                            m("label", [
                              "Comment",
                              m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.comment)})
                            ]),
                            m("button", "Submit")
                          ])
                        ]),
                      ])
                    : ""
                  ])
                })
                .render()
            ]),
          ])
        ])
      ]),
    ]
  )
}

request.summary = function(ctrl){
  return m(".request-stub", [
    m(".section.type", [
      ctrl.request().projectType
    ]),
    m(".section", [
      displayEditGroup.view(
        ctrl,
        ctrl.degDescription,
        function(){ return m("h4", ctrl.request().description) }, 
        function(){
          return m("div", [
            m("input", {type: "text", value: ctrl.request().description, onchange: m.withAttr("value", ctrl.degDescription.input)}),
          ])
        }
      ),
      m("p.meta", [
        "Posted by ",
        m("a",{href: "/users/"+ctrl.request().authorId, config: m.route}, ctrl.author().name),
        m("br"),
        " on "+(new Date(ctrl.request().date).toString()), // change this as people modify this. "Last edited by _____"
      ]),
    ]),
    m("hr"),
    m("div.section", [
      m("h5", [m("small", "Processing Time")]),
      m("h5#pending-for.value", common.stagnation(ctrl)),
      m("h5", [m("small", "Amount")]),
      displayEditGroup.view(
        ctrl,
        ctrl.degAmount,
        function(){ return m("h5.value", [helper.commaize(ctrl.request().amount)]) }, 
        function(){ 
          return m("div", [
            m("input", {type: "text", value: ctrl.request().amount, onchange: m.withAttr("value", ctrl.degAmount.input)}),
          ])
        }
      ),
      m("h5", [m("small", "Disaster")]),
      displayEditGroup.view(
        ctrl,
        ctrl.degDisaster,
        function(){ return m("h5.value", [ctrl.request().disaster.type + " " + ctrl.request().disaster.name + " in " + common.displayDate(ctrl.request().disaster.date)]) },
        function(){
          return m("div", [
            m("div", [
              m("label", [
                "Name",
                m("input", {
                  type: "text",
                  value: ctrl.request().disaster.name,
                  onchange: m.withAttr("value", ctrl.degDisaster.input.setName)
                })
              ]),
              m("label", [
                "Type",
                m("select", {
                  onchange: m.withAttr("value", ctrl.degDisaster.input.setType)
                }, ctrl.disasterTypes().map(function (dt){
                  return m("option", {value: dt, selected: dt == ctrl.request().disaster.type}, dt)
                }))
              ]),
              m("label", [
                "Date",
                m("input", {
                  type: "date",
                  value: ctrl.degDisaster.htmlDate() || helper.toDateValue(ctrl.request().disaster.date),
                  onchange: m.withAttr("value", ctrl.degDisaster.input.setDate)
                })
              ])
            ])
          ])
        }
      ),
      m("h5", [m("small", "Location")]),
      displayEditGroup.view(
        ctrl,
        ctrl.degLocation, 
        function(){ return m("h5.value", [ctrl.request().location]) }, 
        function(){ 
          return m("div", [
            m("input", {type: "text", value: ctrl.request().location, onchange: m.withAttr("value", ctrl.degLocation.input)}),
          ])
        }
      ),
    ]),
    m(".map-container", [
      m("#detailMap", {config: ctrl.initMap}),
      ctrl.coords() ?
        ""
      : m(".map-shroud", [
          m("h3", [
            "Map unavailable because requester did not supply coordinates"
          ]),
        ])
    ]),
  ])
}

request.approval = function(ctrl){
  return m("section.approval", {className: ctrl.request().isRejected ? "rejected" : ""}, [
    m(".row", [
      m(".columns.medium-12", [
        ctrl.request().isRejected ?
          m("div", [
            m("h4", [
              "This request has been rejected." 
            ]),
          ])
        : (
          ctrl.canSignoff() ?
            m("div", [
              m("h4", [
                "Sign off on this request only if you feel the information is complete for your step in the approval process."
              ]),
              m("button", {onclick: ctrl.signoffModal.show.bind(ctrl.signoffModal)}, [
                m("i.fa.fa-fw.fa-check"),
                "Sign off"
              ]),
              m("button.alert", {onclick: ctrl.rejectModal.show.bind(ctrl.rejectModal)}, [
                m("i.fa.fa-fw.fa-times"),
                "Reject"
              ])
            ])
          : ctrl.hasSignedoff() ?
            m("div", [
              m("h4", [
                m("div", [m("i.fa.fa-thumbs-up.fa-2x")]),
                "You've already signed off on this request."
              ]),
            ])
          : m("div", [
            m("h4",
              ctrl.getBlockingAgency() === "AWAITING_ASSIGNMENT" ?
                ctrl.app.isSuperAdmin() ?
                  [
                    "Please assign an agency to assess this request.",
                  ]
                : "Waiting for the Office of Civil Defense to assign an agency to assess this request."
              : "Waiting for " + ctrl.getBlockingAgency() + " approval."
            ),
            m("div",
              ctrl.getBlockingAgency() === "AWAITING_ASSIGNMENT" ?
                ctrl.app.isSuperAdmin() ?
                  [
                    m("button.alert", {onclick: ctrl.rejectModal.show.bind(ctrl.rejectModal)}, [
                      m("i.fa.fa-fw.fa-times"),
                      "Reject"
                    ])
                  ]
                : ""
              : ""
            ),
          ])
        ),
        ctrl.currentUserIsAuthor() && !ctrl.hasSignedoff() ?
          m("div", [
            m("h5", [
              "You created this request."
            ]),
          ])
        : ""
      ]),
    ])
  ])
}

request.progress = function(ctrl){
  var steps = _.range(6);
  return m("section", [
    m(".row", [
      m(".columns.medium-12", [
        m(".progress", [
          _.chain(steps)
            .map(function(step){
              return m(".step", {
                style: {width: (100/steps.length + '%')},
                className: (ctrl.request().level >= step ? 'done ' : '') +
                  (ctrl.request().level === (step - 1) ? 'pending' : '')
              }, [
                process.levelDict[step]
              ])
            })
            .value()
        ]),
      ]),
    ]),
  ])
}

request.miniProgress = function(request){
  return m(".progress.mini", [
    m(".step", {
      style: {width: (100/6 * (request.level + 1) + '%')},
      className: "done"
    })
  ])
}

request.listView = function(reqs, sortBy){
  return m("table", [
      m("thead", [
        m("tr", [
          m("th", [
            m("a", {onclick: function(){ sortBy("id") }}, [
              "Id"
            ]),
          ]),
          m("th", [
            m("a", {onclick: function(){ sortBy("age") }}, [
              "Stagnation"
            ]),
          ]),
          m("th", "Name"),
          m("th", "Gov Unit"),
          m("th", [
            m("a", {onclick: function(){ sortBy("level") }}, [
              "Status"
            ]),
          ]),
          m("th.text-right", [
            m("a", {onclick: function(){ sortBy("amount") }}, [
              "Amount"
            ]),
          ])
        ])
      ]),
      m("tbody", [
        reqs.length ?
          reqs
            .map(function(p){
              return m("tr", [
                m("td", p.id),
                m("td", [common.day(p.age)]),
                m("td", [
                  m("a.name", {
                    href: routes.controllers.Requests.view(p.id).url,
                    config: m.route
                  }, p.description)
                ]),
                m("td", p.author.govUnit),
                m("td", [
                  !p.isRejected ?
                    request.miniProgress(p)
                  : m(".label.alert", [
                    "Rejected"
                  ])
                ]),
                // m("td", p.pType),
                m("td.text-right", helper.commaize(p.amount.toFixed(2)))
              ])
            })
        : m("tr", [m("td", "No requests matched filter criteria")])
      ])
    ])
}
