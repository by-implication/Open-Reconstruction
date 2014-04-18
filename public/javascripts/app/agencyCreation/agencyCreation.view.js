agencyCreation.view = function(ctrl){
  var sections
  return app.template(ctrl, [
    common.banner("New Agency"),
    m("form", [
      common.formSection(
        "fa-star",
        [
          common.field(
            "Agency Name",
            m("input[type='text']")
          ),
          common.field(
            "Agency Acronym",
            m("input[type='text']")
          ),
          common.field(
            "Agency Role",
            m("select", [
              m("option", "NGA"),
            ])
          )
        ]
      ),
      common.formSection(
        null,
        [
          m("button", "Submit")
        ]
      )
    ]),
  ])
}