faq.view = function(ctrl){
  return app.template(ctrl.app, "Home", [
    m("div#home", [
      m("section.banner", [
        m(".row", [
          m(".columns.medium-11", [
            m("div#logo"),
            m("h1", "Open Reconstruction"),
            m("p", [
              "Tracking post-disaster reconstruction spending. Rebuilding a better Philippines, for all to see."
            ])
          ]),
        ])
      ])
    ])
  ]);
}