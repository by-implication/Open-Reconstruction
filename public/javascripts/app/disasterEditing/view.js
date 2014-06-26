disasterEditing.view = function(ctrl){
  return app.template(ctrl.app, ctrl.id ? "Editing Disaster" : "New Disaster", [
    common.banner(ctrl.id ? "Editing Disaster" : "New Disaster"),
    m("form", {onsubmit: ctrl.submit}, [
      m("section", [
        m(".row", [
          m(".columns.medium-8", [
            common.field(
              "Name",
              m("input", {value: ctrl.name(), onchange: m.withAttr("value", ctrl.name), type: 'text', placeholder: 'Yolanda, Pepeng, Piping, Popong, etc...'}),
              "Only if it applies. Please be careful with spelling."
            ),
            common.field(
              "Type",
              m("select", {onchange: m.withAttr("value", ctrl.typeId)},
                ctrl.disasterTypes().map(function (dt){
                  return m("option", {value: dt.id, selected: dt.id == ctrl.typeId()}, dt.name);
                })
              )
            ),
            common.field(
              "Date",
              m("input", {type: "date", value: ctrl.htmlDate(), onchange: m.withAttr("value", ctrl.htmlDate)})
            )
          ]),
        ]),
        m(".row", [
          m(".columns.medium-8", [
            m("button", "Submit")
          ]),
        ]),
      ]),
    ]),
  ])
}