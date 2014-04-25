lguListing.view = function(ctrl){

  function renderLGU(lgu){

    var level = lgu.level || 0;

    return m(".lgu", [
      m(".info", [
        (level ?
          m("a", {href: "/agencies/" + lgu.id}, lgu.name) :
          m("span", lgu.name)
        ),
        (lgu.level < 3 ?
          m("a", {href: "/lgus/new/" + level + "/" + lgu.id}, "+") :
          ""
        )
      ]),
      m(".children", (lgu.children && lgu.children.map(renderLGU)) || []),
    ])
  }
  
  return app.template(ctrl.app, [
    common.banner("LGU Manager"),
    ctrl.app.isSuperAdmin()?
      m("section", [
        m(".row", [
          m(".columns.medium-8", ctrl.regions().map(renderLGU)),
        ]),
      ]) : ""
  ])
}