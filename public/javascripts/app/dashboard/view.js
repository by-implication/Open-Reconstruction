dashboard.view = function(ctrl){
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
          common.stickyTabs.menu(ctrl.projectVisTabs, {className: "vertical", config: ctrl.scrollHandler}),
          m(".tabs-content.vertical",
            _.chain(visualizations.library)
              .groupBy(function(v){
                return v(ctrl).type();
              })
              .map(function(g, key){
                return [m(".section", {id: key + "-visualizations"}, [
                  // (i > 0) ? m("hr") : "",
                  m("h2.section-title", [
                    key, 
                    " Visualizations"
                  ]),
                  m("ul.medium-block-grid-2", g.map(function(v){
                    return m("li", [
                      visPanel.view(v(ctrl))
                    ])
                  })),
                ]),
                m("hr")
              ]
              })
              .value()
          ),
        ]),
      ])
    ])
  ]);
}
