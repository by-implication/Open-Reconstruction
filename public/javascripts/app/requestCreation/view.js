requestCreation.view = function(ctrl){

  function cancel(){ history.back(); }

  // function scopeLabel(scope){
  //   switch(scope){
  //     case "Reconstruction": return "Completely destroyed, and we need to rebuild it";
  //     case "Repair": return "Partially damaged, and we need to repair it";
  //     case "Prevention": return "Does not currently exist, and we need to build it for prevention";
  //     default: return scope;
  //   }
  // }

  function projectTypeGroups(indexArr){
    return indexArr.map(function (i){
      var projectType = ctrl.info().projectTypes[i];
      return m("option", {value: projectType.id}, projectType.name);
    });
  }

  return app.template(ctrl.app, "New Request", {className: "detail"}, [
    common.banner("New Project Request"),
    [ // modals
      common.modal.view(
        ctrl.locModal,
        function (ctrl){
          return common.field(
            "Location",
            m("div", {id: "map", config: ctrl.initMap}),
            "Tell us where the project is. Use the pin icon on the left side of the map (below the zoom controls) to place a pin on the map."
          )
        }
      ),
      common.modal.view(
        ctrl.attModal,
        function (ctrl){
          return "Attachments";
        }
      )
    ],
    m(".row", [
      m(".columns.large-12", [
        m(".card", [
          m("form", {onsubmit: ctrl.submitNewRequest}, [
            m(".section", [
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
            ctrl.preamble() ? m("div", [
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
                  m("select", [
                    m("option", [
                      "option1"
                    ]),
                  ])
                )
              ]),
              m(".section", [
                m("h2", [
                  "Specific Requests"
                ]),
                m("p.help", [
                  "Each of these requests will get their own page, with their own statuses and tracking."
                ]),
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
                      m("th", [
                        "Attachments"
                      ]),
                      m("th", [
                        "Edit"
                      ]),
                    ]),
                  ]),
                  m("tbody", ctrl.entries.map(function(e){
                    return m("tr", [
                      m("td", [
                        m("input", {onchange: m.withAttr("value", e.description), type: "text", placeholder: "e.g. Reconstruction of a seawall for barangay A"}),
                      ]),
                      m("td", [
                        m("input", {type: "number", onchange: m.withAttr("value", e.amount)}),
                      ]),
                      m("td", [
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
                      m("td", [
                        m("td", [
                          m("button[type=button].tiny", {onclick: e.openLocationModal}, "Set location")
                        ])
                      ]),
                      m("td", [
                        m("td", [
                          m("button[type=button].tiny", {onclick: e.openAttachmentsModal}, "Add attachments")
                        ])
                      ]),
                      m("td", [
                        m("button.alert[type=button].tiny", {onclick: e.remove}, "Delete")
                      ])
                    ])
                  })),
                ]),
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
                    m("button", {type: "button", class: "alert", onclick: cancel}, "Cancel"),
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