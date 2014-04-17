admin.view = function(ctrl){
  return app.template(ctrl, [
    common.banner("Administrative Interface"),
    m("section", [
      m(".row", [
        m(".columns.medium-4", [
          "derp"
        ]),
      ]),
    ]),
    console.log(ctrl.app.getLoggedIn().department),
    m.if(ctrl.app.getLoggedIn().department == "OCD", 
      m("section", [
        m(".row", [
          "children",
          // create agencies
          // list of agencies
          m(".columns.medium-8", [
            m("table", [
              m("thead", [
                m("tr", [
                  m("td", [
                    "Agency Name"
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ])
    )
      
  ])
}