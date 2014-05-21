request.view = function(ctrl){

  function extractAgency(r){
    var params = r.event.content.split(" ");
    var agencyType = params.pop();
    return {
      id: parseInt(params.pop()),
      name: params.join(" ")
    };
  }

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
              m.switch(ctrl.requestTabs.currentTab())
                .case("Assignments", function(){
                  return m(".section", [
                    m("p", [
                      "Assessing Agency",
                      m("h4", [
                        ctrl.degAssess.view(
                          function(){
                            return ctrl.assessingAgency().id ?
                              m("a", {href: routes.controllers.GovUnits.view(ctrl.assessingAgency().id).url, config: m.route}, [
                                ctrl.assessingAgency().name
                              ])
                            : "Unassigned";
                          },
                          function(){
                            return m("select", {onchange: m.withAttr("value", ctrl.degAssess.input)},
                              [m("option", {value: 0, selected: ctrl.assessingAgency().id == 0}, "None")]
                              .concat(ctrl.assessingAgencies().map(function(agency){
                                return m("option", {value: agency.id, selected: ctrl.assessingAgency().id == agency.id}, agency.name)
                              }
                            )));
                          },
                          function (r){
                            var agency = extractAgency(r);
                            if(agency.id){
                              ctrl.assessingAgency(agency);
                              ctrl.request().level = 1;
                            } else {
                              ctrl.assessingAgency(ctrl.unassignedAgency);
                              ctrl.request().level = 0;
                            }
                          }
                        )
                      ]),
                      m("p.help", [
                        "The Assessing Agency will independently validate and assess the suitability of this request for execution. They will be the ones making the program of works, etc..."
                      ]),
                    ]),
                    m("p", [
                      "Implementing Agency",
                      m("h4", [
                        ctrl.degImplement.view(
                          function(){
                            return ctrl.implementingAgency().id ?
                              m("a", {href: routes.controllers.GovUnits.view(ctrl.implementingAgency().id).url, config: m.route}, [
                                ctrl.implementingAgency().name
                              ])
                            : "Unassigned"
                          },
                          function(){
                            return m("select", {onchange: m.withAttr("value", ctrl.degImplement.input)},
                              [m("option", {value: 0, selected: ctrl.implementingAgency().id == 0}, "None")]
                              .concat(ctrl.implementingAgencies().map(function(agency){
                                return m("option", {value: agency.id, selected: ctrl.implementingAgency().id == agency.id}, agency.name)
                              }
                            )));
                          },
                          function (r){
                            var agency = extractAgency(r);
                            if(agency.id){
                              ctrl.implementingAgency(agency);
                            } else {
                              ctrl.implementingAgency(ctrl.unassignedAgency);
                            }
                          }
                        )
                      ]),
                      m("p.help", [
                        "The Implementing Agency will be responsible for the handling the money, and the completion of the request. Most of the time the Assessing Agency and the Implementing Agency are the same, but there are some cases wherein they are different. e.g. A school should probably be assessed by the DPWH, but DepEd should handle implementation."
                      ]),
                    ]),
                  ])
                })
                .case("Images", function(){
                  return m(".section", [
                    ctrl.curUserCanUpload() ?
                      m("div#imageDropzone.dropzone", {config: ctrl.initImageDropzone})
                    : "",

                    ctrl.attachments().imgs.length ?
                      m("ul.attachments-images.small-block-grid-4", ctrl.attachments().imgs.map(function (img){
                        return m("li", [
                          m("img", {src: routes.controllers.Attachments.thumb(img.id).url}),
                          m(".filename", [
                            m("a", {title: "Preview", href: routes.controllers.Attachments.preview(img.id).url, target: "_blank"}, [
                              img.filename
                            ]),
                          ]),
                         
                          m(".uploader", [
                            "Uploaded by ",
                            m("a", {href: routes.controllers.Users.view(img.uploader.id).url, config: m.route},[
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
                                m("a", {href: routes.controllers.Users.view(doc.uploader.id).url, config: m.route}, doc.uploader.name)
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
      ctrl.degDescription.view(
        function(){ return m("h4", ctrl.request().description) },
        function(){
          return m("div", [
            m("input", {type: "text", value: ctrl.request().description, onchange: m.withAttr("value", ctrl.degDescription.input)}),
          ])
        }
      ),
      m("p.meta", [
        "Posted by ",
        m("a",{href: routes.controllers.Users.view(ctrl.author().id).url, config: m.route}, ctrl.author().name),
        m("br"),
        " on "+(new Date(ctrl.request().date).toString()), // change this as people modify this. "Last edited by _____"
      ]),
    ]),
    m("hr"),
    m("div.section", [
      m("h5", [m("small", "Processing Time")]),
      m("h5#stagnation-" + ctrl.id + ".value"), // actual content c/o recursive update function in controller
      m("h5", [m("small", "Amount")]),
      ctrl.degAmount.view(
        function(){ return m("h5.value", [helper.commaize(ctrl.request().amount)]) },
        function(){
          return m("div", [
            m("input", {type: "text", value: ctrl.request().amount, onchange: m.withAttr("value", ctrl.degAmount.input)}),
          ])
        }
      ),
      m("h5", [m("small", "Disaster")]),
      ctrl.degDisaster.view(
        function(){
          var disasterType = ctrl.disasterTypes().filter(function (dt){
            return dt.id == ctrl.request().disaster.typeId;
          })[0];
          return m("h5.value", [
            disasterType.name + " "
            + ctrl.request().disaster.name + " in "
            + common.displayDate(ctrl.request().disaster.date)
          ]
        )},
        function(){

          return m("div", [
            m("div", [
              m("label", [
                "Name",
                m("input", {
                  type: "text",
                  value: ctrl.degDisaster.input().name,
                  onchange: m.withAttr("value", ctrl.degDisaster.input.setName)
                })
              ]),
              m("label", [
                "Type",
                m("select", {
                  onchange: m.withAttr("value", ctrl.degDisaster.input.setTypeId)
                }, ctrl.disasterTypes().map(function (dt){
                  return m("option", {value: dt.id, selected: dt.id == ctrl.request().disaster.typeId}, dt.name)
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
      ctrl.degLocation.view(
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
                  "Please assign an agency to assess this request."
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
                m("td", [m("a",
                  {href: routes.controllers.GovUnits.view(p.author.govUnit.id).url, config: m.route},
                  p.author.govUnit.name)]),
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
