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

  var photoReqt = ctrl.requirements()[0][0];

  return app.template(ctrl.app, "New Request", {className: "detail"},[
      common.modal.view(
        ctrl.locModal,
        function (modCtrl){
          return [
            m(".section", [
              m("h2", [
                "Location for " + (ctrl.activeEntry().description() ? ctrl.activeEntry().description() : "Project")
              ]),
              m("p.help", [
                "Tell us where the project is.You can either:"
              ]),
            ]),
            m("hr"),
            m(".section", [
              m(".row", [
                m(".columns.large-8", [
                  m("h4", [
                    "Using the map"
                  ]),
                  m("p.help", [
                    "Use the button below the zoom controls to drop a pin on the location of the project."
                  ]),
                  m("div", {id: "map", config: modCtrl.initMap})
                ]),
                m(".columns.large-4", [
                  m("h4", [
                    "Using a photo"
                  ]),
                  m("p.help", [
                    "If the photo was taken with a smartphone that has GPS, we can take the location from the photo."
                  ]),
                  m("div.dropzone", {config: ctrl.initDropzone(ctrl.activeEntry(), photoReqt)}, [
                    m(".dz-message", [
                      "Drop documents here or click to browse"
                    ]),
                  ]),
                  m("div", 
                    ctrl.activeEntry().locations().map(function (loc) {
                      if (loc.lat && loc.lng) {
                        return m("img", {
                            src: routes.controllers.Attachments.bucketThumb(loc.key, loc.requirementId, loc.filename).url, 
                            height: 128, 
                            width: 128,
                            onclick: modCtrl.setLocation(loc)
                          }
                        )
                      } else {
                        return m("div.no-location", [
                          m("img", {
                              src: routes.controllers.Attachments.bucketThumb(loc.key, loc.requirementId, loc.filename).url, 
                              height: 128, 
                              width: 128
                            }
                          )
                        ])
                      }
                    })
                  ),
                ]),
              ]),
            ]),
          ]
        },
        "medium-8"
      ),
      common.modal.view(
        ctrl.docModal,
        function (docCtrl){
          return m(".section", [
            m("h2", [
              ctrl.activeEntry().description() ? "Documents for " + ctrl.activeEntry().description() : "Documents"
            ]),
            m("p.help", [
              "While these attachments are necessary for your request to progress, you may submit your request with incomplete attachments, and upload them at a later time."
            ]),
            m("div", docCtrl.items().map(function (reqts, level){
              return m("div", {class: level == 0 ? "current" : ""},
                [
                  m("ul.large-block-grid-3.medium-block-grid-2", [reqts.map(function (reqt){
                    var att = docCtrl.getFor(reqt, ctrl.activeEntry().attachments())[0];
                    var uploadDate = att && new Date(att.dateUploaded);
                    var thumb = (att && reqt.isImage) ? m("img", {src: routes.controllers.Attachments.bucketThumb(att.key, reqt.id, att.filename).url, height: 128, width: 128}) : "";
                    return m("li.document", [
                      m("h4", [
                        reqt.name
                      ]),
                      att ? m(
                        "div", [
                          thumb,
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
      common.modal.view(
        ctrl.imgModal,
        function (imgCtrl){
          return m(".section", [
            m("h2", [
              ctrl.activeEntry().description() ? "Images for " + ctrl.activeEntry().description() : "Images"
            ]),
            m("p.help", [
              "While these attachments are necessary for your request to progress, you may submit your request with incomplete attachments, and upload them at a later time."
            ]),
            m("div", imgCtrl.items().map(function (reqts, level){
              var reqt = reqts[0];
              var atts = imgCtrl.getFor(reqt, ctrl.activeEntry().attachments());

              return m("div", {class: level == 0 ? "current" : ""},[
                m(".document", [
                  m("div.dropzone", {config: ctrl.initDropzone(ctrl.activeEntry(), reqt)}, [
                    m(".dz-message", [
                      "Drop documents here or click to browse"
                    ]),
                  ])
                ]),
                m("ul.large-block-grid-3.medium-block-grid-2", atts.map(function(att){
                  var uploadDate = new Date(att.dateUploaded);
                  var thumb = reqt.isImage ? m("img", {src: routes.controllers.Attachments.bucketThumb(att.key, reqt.id, att.filename).url, height: 128, width: 128}) : "";
                  return m("li.document", [
                    m("h4", [
                      reqt.name
                    ]),
                    m("element", [
                      m("div", [
                        thumb,
                        m("a", {href: routes.controllers.Attachments.bucketDownload(att.key, reqt.id, att.filename).url}, att.filename),
                        " uploaded ",
                        m("span", {title: uploadDate}, helper.timeago(uploadDate)),
                        " by ",
                        m("a", {href: routes.controllers.Users.view(att.uploader.id).url}, att.uploader.name),
                        m("a", {href: routes.controllers.Attachments.bucketPreview(att.key, reqt.id, att.filename).url}, "[PREVIEW]")
                      ])
                    ]),
                  ]); 
                })),
              ])
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
                            m("button[type=button].tiny", {onclick: e.openDocumentsModal}, "Add documents" +
                              (e.attachments().length ? " (" + e.attachments().filter(function(a){return !a.isImage}).length + " uploaded)" : "")
                            )
                          ]),
                          m("li", [
                            m("button[type=button].tiny", {onclick: e.openImagesModal}, "Add images" +
                              (e.attachments().length ? " (" + e.attachments().filter(function(a){return a.isImage}).length + " uploaded)" : "")
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
