lguListing.view = function(ctrl){

  function renderLGU(lgu){
    // lgu.isExpanded = false;
    var level = lgu.level();

    return m(".lgu", [
      m(".info", [
        m("label", [
          m("input", {type: "checkbox", onchange: m.withAttr("checked", lgu.isExpanded)}),
        ]),
        (level ?
          m("a", {href: "/agencies/" + lgu.id()}, lgu.name()) :
          m("span", lgu.name())
        ),
        (level < 3 ?
          m("a.button.micro", {href: "/lgus/new/" + level + "/" + lgu.id()}, "+") :
          ""
        )
      ]),
      lgu.isExpanded() ?
        m(".children", (lgu.children && lgu.children() && lgu.children().map(renderLGU)) || []) :
        null
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