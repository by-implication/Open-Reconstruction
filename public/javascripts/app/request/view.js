request.view = function(ctrl){

  var levelDict = [
    "Submission",
    "Agency Validation",
    "OCD Validation"
  ];

  return app.template(
    ctrl.app,
    "Request — " + ctrl.request().description,
    {className: "detail"},
    [ // modals
      common.modal.view(
        ctrl.requirementsModal,
        function (ctrl){
          return m("form", {onsubmit: ctrl.submit}, [
            m(".section", [
              m("h3", "Requirements")
            ]),
            m("hr"),
            m(".section", ctrl.requirements().map(function (reqts, level){
              return m("div", [
                m("h4", levelDict[level]),
                m("ul", reqts.map(function(reqt){
                  return m("label", [
                    m("input", {
                      type: "checkbox",
                      onchange: m.withAttr("checked", ctrl.requiredMap[reqt.id]),
                      checked: ctrl.requiredMap[reqt.id]()
                    }),
                    reqt.name
                  ])
                })),
              ]);
            }).concat([
              m("button", ["Submit"]),
              m("button.alert", {type: "button", onclick: ctrl.close}, "Cancel")
            ]))
          ]);
        }
      ),
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
        function (ctrl){
          return m("form", {onsubmit: ctrl.submit}, [
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
              common.field(
                "Type",
                m("select", {onchange: m.withAttr("value", ctrl.project.typeId)},
                  [m("option", {value: 0, selected: true}, "--- Please pick one ---")].concat(
                    ctrl.projectTypes().map(function (o){
                      return m("option", {value: o.id}, o.name);
                    })
                  )
                )
              ),
              common.field(
                "Scope",
                m("select", {onchange: m.withAttr("value", ctrl.project.scope)},
                  [m("option", {value: 0, selected: true}, "--- Please pick one ---")].concat(
                    ctrl.projectScopes().map(function (o){
                      return m("option", {value: o.value}, o.label);
                    })
                  )
                )
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
      // ctrl.isInvolved() ? request.approval(ctrl) : "",
      request.approval(ctrl),
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
                  ctrl.request().isLegacy ? "This is a LEGACY request. " : "",
                  ctrl.app.isAuthorized(process.permissions.CREATE_LEGACY_REQUESTS) ?
                    m("a", {
                      href: routes.controllers.Requests.edit(ctrl.id).url,
                      config: m.route
                    }, "Click here to edit special fields.") : ""
                ]),
                m(".content", [
                  
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
                    m(".columns.large-4", [
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
                    m(".columns.large-4", [
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
                    m(".columns.large-4", [
                      m("p", [
                        "Executing Agency",
                        ctrl.degs.execute.view(
                          function(){
                            return ctrl.executingAgency().id ?
                              m("h4", [
                                m("a", {href: routes.controllers.GovUnits.view(ctrl.executingAgency().id).url, config: m.route}, [
                                  ctrl.executingAgency().name
                                ])
                              ])
                            : m("h4", "Unassigned");
                          },
                          function(){
                            return m("select", {onchange: m.withAttr("value", this.input)},
                              [m("option", {value: 0, selected: ctrl.executingAgency().id == 0}, "None")]
                              .concat(ctrl.executingAgencies().map(function(agency){
                                return m("option", {value: agency.id, selected: ctrl.executingAgency().id == agency.id}, agency.name)
                              }
                            )));
                          }
                        ),
                        m("p.help", [
                          "The Executing Agency will be in charge of execution."
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              m("hr"),
              m(".big.section#documents", [
                m(".header", [
                  ctrl.app.isSuperAdmin() ? 
                    m("a.button.right", {onclick: ctrl.requirementsModal.initAndOpen}, [
                      "Click here to edit requirements"
                    ]) 
                  : "",
                  m("h1", ["Documents"]),
                ]),
                m(".content", [
                  m(".row", [
                    m(".columns.medium-12", [
                      ctrl.requirements().map(function (reqts, level){

                        return m("div", {class: level == (ctrl.request().level+1) ? "current" : ""},
                          [
                            m("h2", levelDict[level]),
                            m("ul.large-block-grid-3.medium-block-grid-2", [reqts
                                .filter(function (reqt){ return _.contains(ctrl.required(), reqt.id); })
                                .map(function (reqt){
                              var att = ctrl.attachmentFor(reqt, ctrl.attachments());
                              var uploadDate = att && new Date(att.dateUploaded);
                              var canUpload = ctrl.curUserCanUpload();
                              return m("li.document", [
                                m("h4", [
                                  reqt.name
                                ]),
                                att ? m(
                                  ".file", [
                                    m(".info", [
                                      m("a", {href: routes.controllers.Attachments.download(att.id).url}, att.filename),
                                      " uploaded ",
                                      m("span", {title: uploadDate}, helper.timeago(uploadDate)),
                                      " by ",
                                      m("a", {href: routes.controllers.Users.view(att.uploader.id).url}, att.uploader.name),
                                    ]),
                                    m("ul.button-group.round", [
                                      m("li", [
                                        m("a.button.tiny", {href: routes.controllers.Attachments.preview(att.id).url, title: "preview"}, [
                                          m("i.fa.fa-fw.fa-lg.fa-eye")
                                        ]),
                                      ]),
                                      canUpload ?
                                        m("li", [
                                          m("a.button.tiny", {onclick: function(){ ctrl.archive(att); }, title: "archive"}, [
                                            m("i.fa.fa-fw.fa-lg.fa-archive")
                                          ])
                                        ])
                                      : ""
                                    ]),


                                  ]
                                ) : (
                                  canUpload ?
                                  m(".dropzone", {config: ctrl.initAttachmentDropzone(reqt)}, [
                                    m(".dz-message", "Drop documents here or click to browse")
                                  ])
                                  : "No documents have been uploaded yet."
                                )
                              ]);
                            })])
                          ]
                        );

                      })
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
                    m("button.tiny.right", {type: "button", onclick: ctrl.addProjectModal.open}, [
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
                              // m("a", {href: routes.controllers.Projects.view(p.id).url}, [
                                p.id
                              // ])
                            ]),
                            m("td", [
                              // m("a", {href: routes.controllers.Projects.view(p.id).url}, [
                                p.name
                              // ])
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

  function status(){
    var ba = ctrl.getBlockingAgency();
    switch(ba){
      case "AWAITING_ASSIGNMENT": {
        if(ctrl.app.isSuperAdmin() || ctrl.currentUserBelongsToImplementingAgency()){
          return [
            "Please ",
            m("a", {href: "#assignments", onclick: function(e){
              e.preventDefault();
              $("html, body").animate({scrollTop: $("#assignments").position().top + "px"})
            }}, [
              "assign an agency"
            ]),
            " to " + ((ctrl.request().level <=  1 ) ? "assess" : "execute") + " this request."
          ];
        } else if(ctrl.request().level == 0){
          return "Waiting for the Office of Civil Defense to assign an agency to assess this request.";
        } else {
          var iaName = ctrl.implementingAgency().name || "implementing agency";
          return "Waiting for " + iaName + " to assign an executing agency.";
        }
      }
      case undefined: return "";
      default: return "Waiting for " + ba + " approval."
    }
  }

  return m("section.approval", {className: ctrl.request().isRejected ? "rejected" : ""}, [
    request.progress(ctrl),
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
                m("button", {onclick: ctrl.saroModal.open}, [
                  m("i.fa.fa-fw.fa-check"),
                  "Assign SARO"
                ]),
                m("button.alert", {onclick: ctrl.rejectModal.open}, [
                  m("i.fa.fa-fw.fa-times"),
                  "Reject"
                ])
              ]) :
              m("div", [
                m("h4", [
                  "Sign off on this request only if the information is complete for your step in the approval process."
                ]),
                m("button", {onclick: ctrl.signoffModal.open}, [
                  m("i.fa.fa-fw.fa-check"),
                  "Sign off"
                ]),
                m("button.alert", {onclick: ctrl.rejectModal.open}, [
                  m("i.fa.fa-fw.fa-times"),
                  "Reject"
                ])
              ])
            )
          : (ctrl.hasSignedoff() && (!ctrl.currentUserBelongsToImplementingAgency() || ctrl.executingAgency())) ?
            m("div", [
              m("h4", [
                m("div", [m("i.fa.fa-thumbs-up.fa-2x")]),
                "You've already signed off on this request."
              ]),
            ])
          : m("div", [
            m("h4", [status()]),
            m("div",
              ctrl.getBlockingAgency() === "AWAITING_ASSIGNMENT" ?
                ctrl.app.isSuperAdmin() ?
                  [
                    m("button.alert", {onclick: ctrl.rejectModal.open}, [
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
  var stepDict = {
    "RECEIVED": "Request Received",
    "ASSESSOR_ASSIGNMENT": "Assessor Assignment",
    "ASSESSOR_SIGNOFF": "Assessor Signoff",
    "OCD_SIGNOFF": "OCD Signoff",
    "OP_SIGNOFF": "OP Signoff",
    "SARO_ASSIGNMENT": "SARO Assignment",
    "EXECUTOR_ASSIGNMENT": "Executor Assignment",
    "IMPLEMENTATION": "Implementation"
  }
  return m(".row", [
    m(".columns.medium-12", [
      m(".progress", [
        _.chain(process.levelDict)
          .map(function (step, level, steps){
            return m(".step", {
              style: {width: (100/steps.length + '%')},
              className: (ctrl.request().level >= level ? 'done ' : '') +
                (ctrl.request().level === (level - 1) ? 'pending' : '')
            }, [
              stepDict[step]
              // common.help("wut", true)
            ])
          })
          .value()
      ]),
    ]),
  ])
}

request.miniProgress = function(request){
  return m(".progress.mini", [
    m(".step", {
      style: {width: (100/8 * (request.level + 1) + '%')},
      className: "done"
    })
  ])
}

request.listView = function(reqs, sortBy, ctrl){
  sortBy = sortBy || function(){ return m.route(); };
  ctrl = ctrl || {sort: "id", sortDir: "asc"};
  return m("table.responsive", [
      m("thead", [
        m("tr", [
          m("th", "Name"),
          m("th", [
            m("a", {href: sortBy("id"), config: m.route}, [
              "Id ",
              ctrl.sort === "id" ?
                m("i.fa.fa-fw", {className: (ctrl.sortDir == "asc") ? "fa-angle-up" : "fa-angle-down"})
              : ""
            ]),
          ]),
          m("th", [
            "Stagnation",
            common.help("This is how long the project has been waiting at the current stage.")
          ]),
          m("th", "Gov Unit"),
          m("th", "Implementing Agency"),
          m("th", "Status"),
          m("th.text-right", [
            m("a", {href: sortBy("amount"), config: m.route}, [
              "Amount",
              ctrl.sort === "amount" ?
                m("i.fa.fa-fw", {className: (ctrl.sortDir == "asc") ? "fa-angle-up" : "fa-angle-down"})
              : ""
            ]),
          ])
        ])
      ]),
      m("tbody", [
        reqs.length ?
          reqs
            .map(function(p){
              return m("tr", [
                m("td", [
                  m("a.name", {
                    href: routes.controllers.Requests.view(p.id).url,
                    config: m.route
                  }, p.description)
                ]),
                m("td", p.id),
                m("td", [common.day(p.age)]),
                m("td", [m("a",
                  {href: routes.controllers.GovUnits.view(p.author.govUnit.id).url, config: m.route},
                  p.author.govUnit.name)]),
                m("td", [
                  p.implementingAgency ? 
                    m("a",
                    {href: routes.controllers.GovUnits.view(p.implementingAgency.id).url, config: m.route},
                    p.implementingAgency.name)
                  : "Unassigned"
                ]),
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
