agency.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner(ctrl.agency().name),
    m("section", [
      m("a.button", {href: ("/agencies/"+ctrl.agency().id+"/user-creation"), config: m.route}, [
        "Add new user"
      ]),
      m(".row", "id: " + ctrl.agency().id),
      m(".row", "name: " + ctrl.agency().name),
      m(".row", "acronym: " + ctrl.agency().acronym),
      m(".row", "role: " + ctrl.agency().role),
      m.if(ctrl.app.isAgencyAdmin(ctrl.agency().id), 
        m(".row", 
          ctrl.users().map(function(u){
            return m(".row", u.handle)
          })
        )
      )
    ]),
  ])
}