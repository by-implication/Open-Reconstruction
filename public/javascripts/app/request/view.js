request.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Request — " + ctrl.request().description,
    {className: "detail"},
    [ // modals
      common.modal.view(
        ctrl.saroModal,
        function(ctrl){
          return m("form", {onsubmit: ctrl.submit}, [
            m(".section", [
              m("h3", "SARO Assignment"),
              m("p", [
                "This will be hidden from public view unless explicitly stated otherwise."
              ]),
            ]),
            m("hr"),
            m(".section", [
              common.field("SARO Number", m("input", {
                type: "text",
                onchange: m.withAttr("value", ctrl.content)
              })),
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
      ),
      common.modal.view(
        ctrl.addProjectModal,
        function(ctrl){
          return m("form", {onsubmit: ctrl.submitProject}, [
            m(".section", [
              m("h3", "Reference a Project"),
              m("p", [
                "Should be from the project monitoring system of the implementing agency."
              ]),
            ]),
            m("hr"),
            m(".section", [
              common.field(
                "Name",
                m("input[type='text']", {onchange: m.withAttr("value", ctrl.project.name), placeholder: "Reconstruction of Yolanda-damaged Seawall"})
              ),
              common.field(
                "Amount",
                m("input[type='text']", {onchange: m.withAttr("value", ctrl.project.amount), placeholder: "1750000"})
              ),
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


      // actual content
      m("section", [
        m(".row", [
          common.stickyTabs.menu(ctrl.requestTabs, {className: "vertical", config: common.stickyTabs.config(ctrl.requestTabs)}),
          m(".tabs-content.vertical", [
            m(".card", [
              m(".big.section#summary", [
                m(".header", [
                  m("h1", ["Summary"]),
                ]),
                m(".content", [
                  request.progress(ctrl),
                  ctrl.degs.description.view(
                    function(){ return m("h2", ctrl.request().description) },
                    function(){
                      return m("div", [
                        m("input", {type: "text", value: this.input(), onchange: m.withAttr("value", this.input)}),
                      ])
                    }
                  ),
                  m("p.meta", [
                    "Posted by ",
                    m("a",{href: routes.controllers.Users.view(ctrl.author().id).url, config: m.route}, ctrl.author().name),
                    " on behalf of ",
                    m("a",{href: routes.controllers.GovUnits.view(ctrl.govUnit().id).url, config: m.route}, ctrl.govUnit().name),
                    m("br"),
                    " on "+(new Date(ctrl.request().date).toString()), // change this as people modify this. "Last edited by _____"
                  ]),
                  m(".row", [
                    m(".columns.medium-6", [
                      m("p", [
                        "Processing Time",
                        m("h4#stagnation-" + ctrl.id + ".value", ctrl.request().stagnation), // actual content c/o recursive update function in controller
                      ]),
                      m("p", [
                        "Amount",
                        ctrl.degs.amount.view(
                          function(){ return m("h4", ["PHP " + helper.commaize(ctrl.request().amount)]) },
                          function(){
                            return m("div", [
                              m("input", {type: "text", value: this.input(), onchange: m.withAttr("value", this.input)}),
                            ])
                          }
                        ),
                      ]),
                      m("p", [
                        "Disaster",
                        m("h4", [
                          ctrl.request().disaster.name + " on "
                          + common.displayDate(ctrl.request().disaster.date) + " ",
                          m("span.label", [
                            request.getDTbyId(ctrl.request().disaster.typeId).name
                          ])
                        ]),
                      ]),
                      m("p", [
                        "Location",
                        ctrl.degs.location.view(
                          function(){ return m("h4.value", [ctrl.request().location]) },
                          function(){
                            return m("div", [
                              m("input", {type: "text", value: this.input(), onchange: m.withAttr("value", this.input)}),
                            ])
                          }
                        ),
                      ]),
                    ]),
                    m(".columns.medium-6", [
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
                    ]),
                  ]),
                ]),
              ]),
              m("hr"),
              m(".big.section#assignments", [
                m(".header", [
                  m("h1", ["Assignments"]),
                  m("p.help", [
                    "Because the tasks described below are technical, they need to be assigned to the appropriate agencies specialized to handle this request. Currently, the OCD assigns the appropriate agencies."
                  ]),
                ]),
                m(".content", [
                  m(".row", [
                    m(".columns.medium-6", [
                      m("p", [
                        "Assessing Agency",
                        ctrl.degs.assess.view(
                          function(){
                            return ctrl.assessingAgency().id ?
                              m("h4", [
                                m("a", {href: routes.controllers.GovUnits.view(ctrl.assessingAgency().id).url, config: m.route}, [
                                  ctrl.assessingAgency().name
                                ])
                              ])
                            : m("h4", "Unassigned");
                          },
                          function(){
                            return m("select", {onchange: m.withAttr("value", this.input)},
                              [m("option", {value: 0, selected: ctrl.assessingAgency().id == 0}, "None")]
                              .concat(ctrl.assessingAgencies().map(function(agency){
                                return m("option", {value: agency.id, selected: ctrl.assessingAgency().id == agency.id}, agency.name)
                              }
                            )));
                          }
                        ),
                        m("p.help", [
                          "The Assessing Agency will independently validate and assess the suitability of this request for execution. They will be the ones making the program of works, etc..."
                        ]),
                      ]),
                    ]),
                    m(".columns.medium-6", [
                      m("p", [
                        "Implementing Agency",
                        ctrl.degs.implement.view(
                          function(){
                            return ctrl.implementingAgency().id ?
                              m("h4", [
                                m("a", {href: routes.controllers.GovUnits.view(ctrl.implementingAgency().id).url, config: m.route}, [
                                  ctrl.implementingAgency().name
                                ])
                              ])
                            : m("h4", "Unassigned");
                          },
                          function(){
                            return m("select", {onchange: m.withAttr("value", this.input)},
                              [m("option", {value: 0, selected: ctrl.implementingAgency().id == 0}, "None")]
                              .concat(ctrl.implementingAgencies().map(function(agency){
                                return m("option", {value: agency.id, selected: ctrl.implementingAgency().id == agency.id}, agency.name)
                              }
                            )));
                          }
                        ),
                        m("p.help", [
                          "The Implementing Agency will be responsible for handling the money, and the completion of the request. Most of the time the Assessing Agency and the Implementing Agency are the same, but there are some cases wherein they are different. e.g. A school should probably be assessed by the DPWH, but DepEd should handle implementation."
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              m("hr"),
              m(".big.section#documents", [
                m(".header", [
                  m("h1", ["Documents"]),
                ]),
                m(".content", [
                  m(".row", [
                    m(".columns.medium-4", [
                      m("h4", [
                        "What documents are needed?"
                      ]),
                      request.requirements(ctrl),
                    ]),
                    m(".columns.medium-8", [
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
                    ]),
                  ]),
                ]),
              ]),
              m("hr"),
              m(".big.section#references", [
                m(".header", [
                  m("h1", ["References"]),
                  m("p.help", [
                    "These are references to other systems. For example, the SAROs are generated independently by the eBudget system, but is ultimately associated with a request. The projects, on the other hand are created independently by the implementing agency, effectively splitting the request into manageable projects."
                  ]),
                ]),
                m(".content", [
                  m("h4", "SARO"),
                  ctrl.request().isSaroAssigned ?
                    m("table", [
                      m("thead", [
                        m("tr", [
                          m("td", [
                            "SARO Number"
                          ]),
                          m("td", [
                            "Amount"
                          ]),
                        ]),
                      ]),
                      m("tbody", [
                        m("tr", [
                          m("td", [
                            "hidden"
                          ]),
                          m("td", [
                            "hidden"
                          ]),
                        ]),
                      ]),
                    ])
                  : m("p", [
                    "No SARO has been referenced yet."
                  ]),
                  m("h4", ((ctrl.request().level > 4 && ctrl.currentUserBelongsToImplementingAgency()) ? [
                    "Project Monitoring",
                    m("button.tiny.right", {type: "button", onclick: ctrl.addProjectModal.show.bind(ctrl.addProjectModal)}, [
                      "Reference a Project"
                    ]),
                  ] : ("Projects"))),
                  ctrl.projects().length ?
                    m("table", [
                      m("thead", [
                        m("tr", [
                          m("td", [
                            "Id"
                          ]),
                          m("td", [
                            "Name"
                          ]),
                          m("td", [
                            "Scope"
                          ]),
                          m("td", [
                            "Amount"
                          ])
                        ]),
                      ]),
                      m("tbody",
                        ctrl.projects().map(function(p){
                          return m("tr", [
                            m("td", [
                              p.id
                            ]),
                            m("td", [
                              p.name
                            ]),
                            m("td", [
                              p.scope
                            ]),
                            m("td", [
                              helper.commaize(p.amount)
                            ])
                          ])
                        })
                      ),
                    ])
                  : m("p", [
                    "No projects have been referenced yet."
                  ]),
                ]),
              ]),
              m("hr"),
              m(".big.section#activity", [
                m(".header", [
                  m("h1", ["Activity"]),
                ]),
                m(".content", [
                  m("div", ctrl.history().map(function (e){
                    return historyEvent[e.kind].bind(ctrl)(e);
                  })
                  .reverse()
                  ),
                  m.cookie().logged_in ?
                    m(".event.new-comment", [
                      m("form", {onsubmit: ctrl.submitComment}, [
                        m("label", [
                          m("h3", [
                            "New Comment"
                          ]),
                          m("textarea", {onchange: m.withAttr("value", ctrl.input.comment)})
                        ]),
                        m("button", "Submit")
                      ])
                    ])
                  : ""
                ])
              ]),
            ]),
          ]),
        ]),
      ]),
    ]
  )
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
            (ctrl.app.isDBM() ?
              m("div", [
                m("h4", [
                  "Please assign a SARO to this request."
                ]),
                m("button", {onclick: ctrl.saroModal.show.bind(ctrl.saroModal)}, [
                  m("i.fa.fa-fw.fa-check"),
                  "Assign SARO"
                ]),
                m("button.alert", {onclick: ctrl.rejectModal.show.bind(ctrl.rejectModal)}, [
                  m("i.fa.fa-fw.fa-times"),
                  "Reject"
                ])
              ]) :
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
            )
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
                    "Please ",
                    m("a", {href: "#assignments", onclick: function(e){
                      e.preventDefault();
                      $("html, body").animate({scrollTop: $("#assignments").position().top + "px"})
                    }}, [
                      "assign an agency"
                    ]),
                    " to assess this request."
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

request.requirements = function(ctrl){
  var list = {
    "Submission": {
      "LGU": [
        "Sangguniang Resolution declaring the area under a State of Calamity / Imminent Danger and appropriating local counterpart for the project;",
        "Certification by Local Chief Executive (LCE) concerned thru a Sangguniang Resolution assuring that whatever amount will be provided by the Office of the President (OP), the project will be completed/finished;",
        "Certification and justification by the LCE concerned that funding requests chargeable against Calamity Fund are of an emergency in character;",
        "Certification by the Local Accountant or Finance Officer that their Local Calamity Fund is already depleted/exhausted and/or non – availability of funding source other than the Calamity Fund;",
        "Certification that the infrastructures being requested for funding support are not covered by insurance;"
      ],
      "NGA": [
        "Work and financial program/plan of the agency;",
        "Endorsement of the Department Secretary or Head of Agency requesting for funding assistance;"
      ]
    },
    "Agency Validation": {
      "LGU": [
        "Certification by the DPWH that the concerned LGU is capable of implementing the project",
        "Other pertinent documents which may be required by the Council such as an independent validation of the project by the DPWH Regional Director/District Engineer",
        "Validation/recommendation from the Secretary DPWH"
      ],
      "NGA": [
        "Validation/evaluation of appropriate agency to whom the NDRRMC referred the request"
      ]
    },
    "OCD Validation": {
      "LGU": [
        "Local Disaster Risk reduction and Management Council (DRRMC) Damage Report/ Calamity Impact Assessment Report/ Work and financial Plan (to include colored pictures)",
        "Endorsement of RDRRMC Chairperson (OCD Regional Director)"
      ],
      "NGA": [
        "Other pertinent documents which may be required by the Council such as an independent evaluation of the project from the concerned agencies/departments (additional documents may be requested by OCD via comments)"
      ]
    }
  }

  return m("div", [
    m('select', {onchange: m.withAttr("value", ctrl.requirementLevel)}, 
      Object.keys(list).map(function(k){
        return m("option" + (ctrl.requirementLevel() == k ? '[selected="true"]' : ""), k)
      })
    ),
    m("div", 
      _.map(list[ctrl.requirementLevel()], function(docs, party){
        return m("div", [
          m("h4", [
            party
          ]),
          m("ol", docs.map(function(doc){
            return m("li", [
              doc
            ])
          })),
        ]);
      })
    ),
  ])

}

request.progress = function(ctrl){
  return m("section", [
    m(".row", [
      m(".columns.medium-12", [
        m(".progress", [
          _.chain(process.levelDict)
            .map(function (step, level, steps){
              return m(".step", {
                style: {width: (100/steps.length + '%')},
                className: (ctrl.request().level >= level ? 'done ' : '') +
                  (ctrl.request().level === (level - 1) ? 'pending' : '')
              }, step)
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
            m("a", {href: sortBy("id"), config: m.route}, [
              "Id "
            ]),
          ]),
          m("th", "Stagnation"),
          m("th", "Name"),
          m("th", "Gov Unit"),
          m("th", "Status"),
          m("th.text-right", [
            m("a", {href: sortBy("amount"), config: m.route}, [
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
