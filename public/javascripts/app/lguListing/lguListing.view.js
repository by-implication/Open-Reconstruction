lguListing.view = function(ctrl){

  function renderLGU(lgu){
    return m("div", [
      m("span", lgu.name),
      m("a", {href: "/lgus/new/" + lgu.id}, "+")
    ].concat((lgu.children && lgu.children.map(renderLGU)) || []));
  }
  
  return app.template(ctrl.app, [
    common.banner("LGU Manager"),
    ctrl.app.isSuperAdmin()?
      m("section", [
        m(".row", [
          m(".columns.medium-8", ctrl.regions().map(function (region){
            return m("div.region", [
              m("div.name", region.name)].concat(region.provinces.map(function (prov){
                return m("div.province",  [
                  m("span.name", prov.name),
                  m("a", {href: "/lgus/new/" + prov.id}, "+")
                ].concat((prov.children && prov.children.map(renderLGU)) || []));
              })
            ))
          })),
        ]),
      ]) : ""
  ])
}