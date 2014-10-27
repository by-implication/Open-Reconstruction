requestCreation.view = function(ctrl){

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

  if(!ctrl.govUnit()){
    var govUnit = ctrl.app.currentUser().govUnit;
    ctrl.govUnit({ id: govUnit.id, text: govUnit.name });
  }

  return app.template(ctrl.app, "New Request", {className: "detail"},[
      common.modal.view(
        ctrl.locModal,
        function (modCtrl){
          return m(".section", [
            m("h2", [
              "Location for " + ctrl.activeEntry().description()
            ]),
            m("p.help", [
              "Tell us where the project is. Use the pin icon on the left side of the map (below the zoom controls) to place a pin on the map."
            ]),
            m("div", {id: "map", config: modCtrl.initMap}),
            m("div.dropzone", {config: ctrl.attModal.initDropzone(ctrl.activeEntry(), ctrl.attModal.requirements()[0][0])}, [
              m(".dz-message", [
                "Drop documents here or click to browse"
              ]),
            ])
          ])
        },
        "medium-8"
      ),
      common.modal.view(
        ctrl.attModal,
        function (ctrl){
          return m(".section", [
            m("h2", [
              "Attachments for " + ctrl.activeEntry().description()
            ]),
            m("p.help", [
              "While these attachments are necessary for your request to progress, you may submit your request with incomplete attachments, and upload them at a later time."
            ]),
            m("div", ctrl.requirements().map(function (reqts, level){
              var levelDict = [
                "Submission",
                "Agency Validation",
                "OCD Validation"
              ];
              return m("div", {class: level == 0 ? "current" : ""},
                [
                  m("ul.large-block-grid-3.medium-block-grid-2", [reqts.map(function (reqt){
                    var att = ctrl.getFor(reqt, ctrl.activeEntry().attachments())[0];
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
                      ) : m("div.dropzone", {config: ctrl.initDropzone(ctrl.activeEntry(), reqt)}, [
                        m(".dz-message", [
                          "Drop documents here or click to browse"
                        ]),
                      ])
                    ]);
                  })])
                ]
              );
            })),
          ]);
        },
        "medium-8"
      ),
    ], [
    common.banner("New Project Request"),
    // modals
    
    m(".row", [
      m(".columns.large-8.large-offset-2", [
        m("div", [
          m("form", {onsubmit: ctrl.submitNewRequest}, [
            m(".section", [
              m("h2", ["Terms of Agreement"]),
              common.field(
                "",
                m("div", [
                  m("input", {type: "checkbox", onchange: m.withAttr("checked", ctrl.preamble)}),
                  m("span", [
                    "I have not requested for assistance for the following projects from any other source."
                  ])
                ])
              )
            ]),
            ctrl.preamble() ? m(".card", [
              m(".section", [
                common.field(
                  "Disaster",
                  m("select", {onchange: m.withAttr("value", ctrl.disasterId)},
                    ctrl.info().disasters.map(function (d){
                      return m("option", {value: d.id}, d.name);
                    })
                  )
                ),
                common.field(
                  "I am making this request in behalf of:",
                  select2.view({
                    value: ctrl.govUnit().id,
                    minimumInputLength: 3,
                    query: function(o){
                      m.request({
                        url: routes.controllers.GovUnits.search(o.term).url,
                        method: "GET",
                        background: true
                      }).then(function (r){
                        o.callback({more: false, results: r.govUnits.concat(ctrl.govUnit())});
                      });
                    },
                    initSelection: function(elem, c){
                      c(ctrl.govUnit());
                    },
                    onchange: function(e){
                      ctrl.govUnit(e);
                    }
                  })
                )
              ]),
              m(".section", [
                m("h2", [
                  "Specific Requests"
                ]),
                m("p.help", [
                  "Each of these requests will get their own page, with their own statuses and tracking."
                ]),
                m("ul", ctrl.entries.map(function(e, index){
                  return m("li.req", [
                    m(".row", [
                      m(".columns.medium-12", [
                        m("button.alert[type=button].tiny.radius.right", {onclick: e.remove}, [
                          m("i.fa.fa-fw.fa-lg.fa-times")
                        ]),
                        m("h3", [
                          e.description() ?
                            e.description()
                          : "Request #" + (index + 1)
                        ]),
                      ]),
                    ]),
                    m(".row", [
                      m(".columns.medium-6", [
                        m("label", [
                          "Description",
                          m("input", {value: e.description(), onchange: m.withAttr("value", e.description), type: "text", placeholder: "e.g. Reconstruction of a seawall for barangay A"}),
                        ]),
                      ]),
                      m(".columns.medium-3", [
                        m("label", [
                          "Type",
                          m("select", {
                            onchange: m.withAttr("value", e.projectTypeId),
                            value: e.projectTypeId()
                          }, [
                            m("optgroup", {label: "Infrastructure"},
                              projectTypeGroups([0, 10])
                            ),
                            m("optgroup", {label: "Water"},
                              projectTypeGroups([5, 7, 8, 9, 12, 13])
                            ),
                            m("optgroup", {label: "Buildings"},
                              projectTypeGroups([1, 3, 6, 11])
                            ),
                            m("optgroup", {label: "Other"},
                              projectTypeGroups([2, 4, 14])
                            ),
                          ])
                        ]),
                      ]),
                      m(".columns.medium-3", [
                        m("label", [
                          "Estimated Amount",
                          m("input", {value: e.amount(), type: "number", onchange: m.withAttr("value", e.amount)}),
                        ]),
                      ]),
                    ]),
                    m(".row", [
                      m(".columns.medium-12", [
                        m("ul.button-group.radius.right", [
                          m("li", [
                            m("button[type=button].tiny", {onclick: e.openLocationModal}, 
                              (e.location() ? " Location set to coordinates: " + e.location() : "Set location")
                            )
                          ]),
                          m("li", [
                            m("button[type=button].tiny", {onclick: e.openAttachmentsModal}, "Add attachments" +
                              (e.attachments().length ? " (" + e.attachments().length + " uploaded)" : "")
                            )
                          ]),
                        ]),
                      ]),
                    ]),
                  ])
                })),
                m("button", {type: "button", onclick: ctrl.newEntry}, [
                  "Add new entry"
                ]),
              ]),
              m(".section", [
                m("ul.button-group", [
                  m("li", [
                    m("button", {disabled: ctrl.submitButtonDisabled(), onclick: function(e){
                      ctrl.submitButtonDisabled(true);
                      ctrl.submitNewRequest(e);
                    }}, "Submit"),
                  ]),
                  m("li", [
                    m("button", {type: "button", class: "alert", onclick: ctrl.cancel}, "Cancel"),
                  ]),
                ]),
              ]),
            ])
            : ""
          ])
        ]),
      ]),
    ]),
  ])
}
