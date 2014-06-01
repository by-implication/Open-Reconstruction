dashboard.view = function(ctrl){
  var listVis = function(){
    return _.chain(visualizations.library)
      .groupBy(function(v){
        return v(ctrl).type();
      })
      .map(function(g){
        return m(".filter-group", [
          m("h4", [
            g[0]().type(),
            " Visualizations"
          ]),
          m("ul.filters", g.map(function(v){
            return m("li.filter", [
              m("a", {href: "visualizations/"+v(ctrl).link(), config: m.route}, [
                v(ctrl).title()
              ])
            ]);
          }))
        ]);
      })
      .value();
  };
  return app.template(ctrl.app, [
    m("div", [
      common.banner("Visualizations"),
      m("section", [
        m(".row",[
          m(".columns.medium-12",[
            m(".notice",[
              "Some introductory text goes here. Explains that this is a live snapshot of data, but you can access the raw data if you make to make your own visualizations. Other obligatory disclaimers and all that."
            ])
          ])
        ])
      ]),
      m("section.alt", [
        m(".row", [
          m(".columns.medium-3", [
            "",
            listVis(),
            "" // wtf why does this fix the duplicaiton bug
          ]),
          m(".columns.medium-9", [
            m("ul.medium-block-grid-2",
              _.chain(visualizations.library)
                .map(function(v){
                  return m("li", [
                    visPanel.view(v(ctrl))
                  ]);
                })
                .value()
            ),
          ]),
        ]),
      ]),
    ])
  ]);
};
