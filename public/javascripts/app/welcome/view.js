welcome.view = function(ctrl){
  return app.template(ctrl.app, [
    m("div#view.welcome", [
      m("section.banner", [
        m("div", {class:"row"}, [
          m("div", {class: "columns medium-8"}, [
            m("h1", "Open Reconstruction"),
            m("p", [
              "Tracking post-disaster reconstruction spending. We need some copy up in here. Maybe a photo, too."
            ]),
            // m("a.button.micro", "Learn More"),
            // m("a.button.micro", "See all requests"),
            // m("a.button.micro", "Stats and Graphs")
          ]),
          m("div", {class: "columns medium-4 info"}, [
            m("h2", "Info 1"),
            m("h2", "Info 2")            
          ])
        ])
      ]),
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            m(".notice", [
              m("i.fa.fa-exclamation-triangle"),
              "Note: This system is very new, and not all legacy data has been imported. Please check back for updates!"
            ])
          ])
        ]),
      ]),
      m("section.alt", [
        m(".row", [
          m(".columns.medium-12", [
            "content goes here. deferred to lower priority. see sketches for details"
          ])
        ]),
      ]),
      m("footer", [
        m(".row", [
          m(".columns.medium-12",
            "This is where the obligatory standard gov.ph footer goes. We need to know what goes in here."
          )
        ])
      ])
    ])
  ]);
};
