requestCreation.view = function(ctrl){

  function cancel(){ history.back(); }

  function scopeLabel(scope){
    switch(scope){
      case "Reconstruction": return "Completely destroyed, and we need to rebuild it";
      case "Repair": return "Partially damaged, and we need to repair it";
      case "Prevention": return "Does not currently exist, and we need to build it for prevention";
      default: return scope;
    }
  }

  function projectTypeGroups(indexArr){
    return indexArr.map(function (i){
      var projectType = ctrl.info().projectTypes[i];
      return m("option", {value: projectType.id}, projectType.name);
    });
  }

  var sections = [
    {
      icon: "fa-briefcase",
      content: [
        m("h2", "Basic Information"),
        // m("h2", "Disaster"),
        

        // m.switch(ctrl.input.projectTypeId())
        //   .case("Bridge", function(){
        //     return common.field(
        //       "Parent Road",
        //       m("input", {type: "text", placeholder: "Tagbilaran North Road"}),
        //       "Tell us on which road this bridge is located."
        //     );
        //   })
        //   .case("Agriculture", function(){
        //     return "agri!";
        //   })
        //   .case("Other", function(){
        //     return "specify!";
        //   })
        //   .render(),
        
      ],
      // help: "Now tell us about this project. Please be as brief as you can when describing your project. Making it simple and easy to understand will make your project more likely to be approved."
    },
    {
      icon: "fa-paperclip",
      content: [
        m(".header", [
          m("h2", ["Documents"]),
        ]),
        m(".content", [
          m(".row", [
            m(".columns.medium-4", [
              m("h4", [
                "What documents do I need?"
              ]),
              ctrl.requirements().map(function (reqts, level){
                var levelDict = [
                  "Submission",
                  "Agency Validation",
                  "OCD Validation"
                ];

                return m("div", {class: level == 0 ? "current" : ""},
                  [
                    m("h2", levelDict[level]),
                    m("ul.large-block-grid-3.medium-block-grid-2", [reqts.map(function (reqt){
                      var att = ctrl.attachmentFor(reqt);
                      var uploadDate = att && new Date(att.dateUploaded);
                      return m("li.document", [
                        m("h4", [
                          reqt.name
                        ]),
                        att ? m(
                          "div", [
                            m("a", {href: routes.controllers.Attachments.bucketDownload(att.key, reqt.id, att.filename).url}, att.filename),
                            " uploaded ",
                            m("span", {title: uploadDate}, helper.timeago(uploadDate)),
                            " by ",
                            m("a", {href: routes.controllers.Users.view(att.uploader.id).url}, att.uploader.name),
                            m("a", {href: routes.controllers.Attachments.bucketPreview(att.key, reqt.id, att.filename).url}, "[PREVIEW]")
                          ]
                        ) : m("div.dropzone", {config: ctrl.initAttachmentDropzone(reqt)})
                      ]);
                    })])
                  ]
                );

              })
            ])
          ]),
        ])
      ]
    },
    {
      content: [
        m("button", {disabled: ctrl.submitButtonDisabled(), onclick: function(e){
          ctrl.submitButtonDisabled(true);
          ctrl.submitNewRequest(e);
        }}, "Submit"),
        m("button", {type: "button", class: "alert", onclick: cancel}, "Cancel"),
      ]
    }
  ]

  return app.template(ctrl.app, "New Request", [
    common.banner("New Project Request"),
    m("form", {onsubmit: ctrl.submitNewRequest }, [
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            m("h2", ["Terms of Agreement"]),
            common.field(
              "",
              m("div", [
                m("input", {type: "checkbox", onchange: m.withAttr("checked", ctrl.preamble)}),
                m("span", [
                  "I have not requested for assistance for this project from any other source."
                ])
              ])
            )
          ]),
        ]),
      ]),
      ctrl.preamble() ? m("div", [
        m("section", [
          m(".row", [
            m(".columns.medium-12", [
              common.field(
                "Disaster",
                m("select", {onchange: m.withAttr("value", ctrl.input.disasterId)},
                  ctrl.info().disasters.map(function (d){
                    return m("option", {value: d.id}, d.name);
                  })
                )
              ),
            ]),
          ]),
        ]),
        m("section.alt", [
          m(".row", [
            m("table", [
              m("thead", [
                m("tr", [
                  m("th", [
                    "Description"
                  ]),
                  m("th", [
                    "Estimated Amount"
                  ]),
                  m("th", [
                    "Type"
                  ]),
                  m("th", [
                    "Location"
                  ]),
                ]),
              ]),
              m("tbody", [
                m("tr", [
                  m("td", [
                    m("input", {onchange: m.withAttr("value", ctrl.input.description), type: "text", placeholder: "e.g. Reconstruction of a seawall for barangay A"}),
                  ]),
                  m("td", [
                    m("input", {type: "number", onchange: m.withAttr("value", ctrl.input.amount)}),
                  ]),
                  m("td", [
                    m("select", {
                      onchange: m.withAttr("value", ctrl.input.projectTypeId),
                      value: ctrl.input.projectTypeId()
                    }, [
                      m("optgroup", {label: "Infrastructure"}, [
                        projectTypeGroups([0, 10])
                      ]),
                      m("optgroup", {label: "Water"}, [
                        projectTypeGroups([5, 7, 8, 9, 12, 13])
                      ]),
                      m("optgroup", {label: "Buildings"}, [
                        projectTypeGroups([1, 3, 6, 11])
                      ]),
                      m("optgroup", {label: "Other"}, [
                        projectTypeGroups([2, 4, 14])
                      ]),
                    ])
                  ]),
                  m("td", [
                    "location"
                  ]),
                ]),
              ]),
            ]),
            // m("ul", [
            //   m("li.card", [
            //     m(".section", [
            //       m(".row", [
            //         m(".columns.medium-6", [
            //           common.field(
            //             "Description",
            //             m("input", {onchange: m.withAttr("value", ctrl.input.description), type: "text", placeholder: "e.g. Reconstruction of a seawall for barangay A"}),
            //             "Please make sure that the description is as specific as can be."
            //           ),
            //           common.field(
            //             "Estimated Amount",
            //             m("input", {type: "number", onchange: m.withAttr("value", ctrl.input.amount)}),
            //             "Note that the agency assigned to evaluate this request may change the amount based on their costing."
            //           ),
            //           common.field(
            //             "Type",
            //             m("select", {
            //               onchange: m.withAttr("value", ctrl.input.projectTypeId),
            //               value: ctrl.input.projectTypeId()
            //             }, [
            //               m("optgroup", {label: "Infrastructure"}, [
            //                 projectTypeGroups([0, 10])
            //               ]),
            //               m("optgroup", {label: "Water"}, [
            //                 projectTypeGroups([5, 7, 8, 9, 12, 13])
            //               ]),
            //               m("optgroup", {label: "Buildings"}, [
            //                 projectTypeGroups([1, 3, 6, 11])
            //               ]),
            //               m("optgroup", {label: "Other"}, [
            //                 projectTypeGroups([2, 4, 14])
            //               ]),
            //             ])
            //           ),
            //         ]),
            //         m(".columns.medium-6", [
            //           common.field(
            //             "Location",
            //             m("div", {id: "map", config: ctrl.initMap}),
            //             "Tell us where the project is. Use the pin icon on the left side of the map (below the zoom controls) to place a pin on the map."
            //           )
            //         ]),
            //       ]),
            //     ]),
            //   ]),
            //   m("li", [
            //     "add new entry"
            //   ]),
            // ]),
          ]),
        ]),
        m("section", [
          m(".row", [
            m(".columns.medium-12", [
              m("button", {disabled: ctrl.submitButtonDisabled(), onclick: function(e){
                ctrl.submitButtonDisabled(true);
                ctrl.submitNewRequest(e);
              }}, "Submit"),
              m("button", {type: "button", class: "alert", onclick: cancel}, "Cancel"),
            ]),
          ]),
        ]),
      ])
      : ""
    ])
  ])
}