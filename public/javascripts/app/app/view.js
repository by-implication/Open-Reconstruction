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
      m("link[href='/assets/bower_components/c3/c3.css'][rel='stylesheet'][type='text/css']")
    ]),
    m("body", attrs, modals.concat(app.navbar(ctrl), content))
  ])
}

// app.feedback = function(ctrl){
//   return m("#feedback-tab", [
//     "feedback"
//   ])
// }

app.navbar = function(ctrl){

  return m("nav.top-bar[data-topbar]", [
    m("ul.title-area", [
      m("li.name", [
        m("h1", [
          m("a", {href: routes.controllers.Application.welcome().url, config: m.route}, "Open Reconstruction")
        ])
      ])
    ]),
    m("section.top-bar-section", [
      m("ul.left", [
        m("li", [
          m("a", {
            href: routes.controllers.Application.welcome().url,
            config: m.route,
            className: (routes.controllers.Application.welcome().url === m.route() ? "active" : "")
          }, "Home")
        ]),
        m("li", [
          m("a", {
            href: routes.controllers.Application.dashboard().url,
            config: m.route,
            className: (routes.controllers.Application.dashboard().url === m.route() ? "active" : "")
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
        ctrl.currentUser().govUnit.id ?
          m("li", [
            m("a", {
              href: routes.controllers.GovUnits.view(ctrl.currentUser().govUnit.id).url,
              config: m.route,
              className: (routes.controllers.GovUnits.view(ctrl.currentUser().govUnit.id).url === m.route() ? "active" : "")
            }, ctrl.currentUser().govUnit.role == "LGU" ? "My LGU" : "My Agency")
          ])
        : "",
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
        m("li", [
          m("button.alert", {type: "button"}, [
            "feedback"
          ]),
        ]),
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
