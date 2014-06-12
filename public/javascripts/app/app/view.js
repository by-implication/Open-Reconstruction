app.template = function(a, b, c, d){
  var ctrl, attrs, content, modals;

  switch(arguments.length){
    case 2:
      ctrl = arguments[0];
      content = arguments[1];
      attrs = {className: ""};
      modals = [];
      break;
    case 3:
      ctrl = arguments[0];
      attrs = arguments[1];
      content = arguments[2];
      modals = [];
      break;
    case 4:
      ctrl = arguments[0];
      attrs = arguments[1];
      modals = arguments[2];
      content = arguments[3];
      break;
  }

  return m("html", [
    m("head", [
      m("meta", {charset: "utf-8"}),
      m("title", [ "Open Reconstruction" ]),
      m("meta", {name: "google", value: "notranslate"}),
      m("link[href='/assets/bower_components/nprogress/nprogress.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/stylesheets/style.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/stylesheets/fonts.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/font-awesome/css/font-awesome.min.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/leaflet/leaflet.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/leaflet-draw/leaflet.draw.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/c3/c3.css'][rel='stylesheet'][type='text/css']"),
      // m("link[href='/assets/bower_components/select2/select2.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/stylesheets/select2-foundation5.css'][rel='stylesheet'][type='text/css']")
    ]),
    m("body", attrs, modals.concat(app.navbar(ctrl), m(".container", content), app.footer(ctrl), app.feedback(ctrl)))
  ])
}

app.feedback = function(ctrl){
  return m("a#feedback-tab", {href:"https://docs.google.com/forms/d/1GUdE6Si1QnnMtVJ8ig8rwECo9DK9BloOXiGVVnj_efw/viewform", target:"potato"}, [
    "feedback"
  ])
}

app.footer = function(ctrl){
  return [
    m("footer", [
      m(".row.notice", [
        m(".columns",
          "The data presented may be incomplete, and is pending refinement by the relevant agencies."
        )
      ]),
      m(".row", [
        m(".large-4.medium-4.columns", [
          m(".row", [
            m(".large-5.columns", [
              m("img[src='http://www.gov.ph/wp-content/themes/govph4/faith-assets/img/govph-seal-mono-footer.png']")
            ]),
            m(".large-7.columns", [
              m("h4", "Republic of the Philippines"),
              m("p", "All content is in the public domain unless otherwise stated."),
              m("p", "Privacy Policy")
            ]),
          ]),
        ]),
      m(".large-6.medium-6.columns", [
        m(".row", [
          m(".large-5.medium-5.columns", [
            m("h4", "About GOVPH"),
            m("p", "Learn more about the Philippine government, its structure, how government works and the people behind it. "),
            m("ul", [
              m("li", "Official Gazette"),
              m("li", "Open Data Portal"),
              m("li", "Send us your feedback"),
            ]),
          ]),
          m(".large-4.medium-4.columns", [
            m("h4", "Government Links"),
            m("ul", [
              m("li", "Office of the President"),
              m("li", "Office of the Vice President"),
              m("li", "Senate of the Philippines"),
              m("li", "House of Representatives"),
              m("li", "Supreme Court"),
              m("li", "Court of Appeals"),
              m("li", "Sandiganbayan")
            ])
          ])
        ])
      ])
    ])
  ])]
}

app.navbar = function(ctrl){

  return m("nav.top-bar[data-topbar]", [
    m("ul.title-area", [
      m("li.name", [
        m(".govph",[
          m("a", {href: "http://gov.ph"}, "GOVPH")
        ])
      ]),
      m("li.divider")
    ]),
    m("section.top-bar-section", [
      m("ul.left", [
        m("li.divider"),
        m("li.name", [
          m("h1", [
            m("a", {
              href: routes.controllers.Application.home().url, 
              config: m.route,
              className: (routes.controllers.Application.home().url === m.route() ? "active" : "")
            }, "Open Reconstruction")
          ])
        ]),
        m("li.divider"),
        // m("li", [
        //   m("a", {
        //     href: routes.controllers.Application.home().url,
        //     config: m.route,
        //     className: (routes.controllers.Application.home().url === m.route() ? "active" : "")
        //   }, [
        //     m("i.fa.fa-home.fa-lg")
        //   ])
        // ]),
        m("li", [
          m("a", {
            href: routes.controllers.Viz.index().url,
            config: m.route,
            className: (routes.controllers.Viz.index().url === m.route() ? "active" : "")
          }, "Visualizations")
        ]),
        // m("li", [
        //   m("a", {
        //     href: routes.controllers.Application.saro().url,
        //     config: m.route,
        //     className: (routes.controllers.Application.saro().url === m.route() ? "active" : "")
        //   }, "SAROs")
        // ]),
        m("li", [
          m("a", {
            href: routes.controllers.Requests.index().url,
            config: m.route,
            className: (m.route().startsWith(routes.controllers.Requests.index().url) ? "active" : "")
          }, "Requests")
        ]),
        ctrl.currentUser().isSuperAdmin ?
          m("li", [
            m("a", {
              href: routes.controllers.Application.admin().url,
              config: m.route,
              className: (m.route().startsWith(routes.controllers.Application.admin().url) ? "active" : "")
            }, "Admin")
          ])
        : ""
      ]),
      m("ul.right", [
        // m("li", [
        //   m("button.alert", {type: "button"}, [
        //     "feedback"
        //   ]),
        // ]),
        m("li.has-dropdown.not-click", [
          m("a", {href: "#"}, [
            m.cookie().logged_in ?
              m("span", [
                m.cookie().logged_in,
                m("span.label", [
                  ctrl.currentUser().govUnit.acronym ?
                    ctrl.currentUser().govUnit.acronym
                    : ctrl.currentUser().govUnit.name
                ]),
              ])
            : "Guest"
          ]),
          m("ul.dropdown", [
            // console.log(ctrl.currentUser().id),
            ctrl.currentUser().id ?
              m("li", [
                m("a", {href: "users/" + ctrl.currentUser().id, config: m.route}, "My Profile"),
              ])
            : "",
            ctrl.currentUser().govUnit.id ?
              m("li", [
                m("a", {
                  href: routes.controllers.GovUnits.view(ctrl.currentUser().govUnit.id).url,
                  config: m.route,
                  className: (routes.controllers.GovUnits.view(ctrl.currentUser().govUnit.id).url === m.route() ? "active" : "")
                }, ctrl.currentUser().govUnit.role == "LGU" ? "My LGU" : "My Agency")
              ])
            : "",
            m.cookie().logged_in ?
              m("li", [
                m("a", {href: routes.controllers.Users.logout().url}, "Log out")
              ])
            : m("li", [
                m("a", {href: routes.controllers.Users.login().url, config: m.route}, "Log in")
              ])
          ])
        ]),
        m("li.loader-padding", {config: bi.loader.init}, [])
      ])
    ])
  ]);
}
