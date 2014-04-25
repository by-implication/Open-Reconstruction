lguListing.view = function(ctrl){

  function renderLGU(lgu){
    // lgu.isExpanded = false;
    var level = lgu.level();

    return m("li.lgu", [
      m(".info", [
        level < 3 && lgu.children().length ?
          m("label.expander", {className: lgu.isExpanded ? "expanded" : ""}, [
            m("input", {type: "checkbox", onchange: m.withAttr("checked", lgu.isExpanded)}),
            m(".control", [
              m("i.fa.fa-caret-right.fa-fw")
            ]),
          ])
        : m("label.expander", []),
        (level ?
          m("a", {href: "/agencies/" + lgu.id()}, lgu.name()) :
          m("span", lgu.name())
        ),
        lgu.children().length ? 
          m("span", [
            " (",
            lgu.children().length,
            " ",
            m.switch(level)
              .case(0, function(){
                return "provinces"
              })
              .case(1, function(){
                return "cities"
              })
              .case(2, function(){
                return "barangays"
              })
              .render(),
            ")"
          ])
        : null,
        (level < 3 ?
          m("a.add.button.micro", {href: "/lgus/new/" + level + "/" + lgu.id()}, [
            m.switch(level)
              .case(0, function(){
                return "Add Province"
              })
              .case(1, function(){
                return "Add City/Municipality"
              })
              .case(2, function(){
                return "Add Barangay"
              })
              .render()
          ]) :
          ""
        )
      ]),
      lgu.isExpanded() ?
        m("ul.children", [
          (lgu.children && lgu.children() && lgu.children().map(renderLGU)) || []
        ]) :
        null
    ])
  }
  
  return app.template(ctrl.app, [
    common.banner("LGU Manager"),
    ctrl.app.isSuperAdmin()?
      m("section", [
        m(".row", [
          m(".columns.medium-8", [
            m("ul", [
              ctrl.regions().map(renderLGU)
            ]),
          ]),
        ]),
      ]) : ""
  ])
}