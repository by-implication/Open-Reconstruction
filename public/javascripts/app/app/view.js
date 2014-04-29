app.template = function(a, b, c, d){
  var ctrl, attrs, content;

  switch(arguments.length){
    case 2:
      ctrl = arguments[0];
      content = arguments[1];
      attrs = {class: ""};
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
      m("title", [ "Open Reconstruction" ]),
      m("meta", {name: "google", value: "notranslate"}),
      m("link[href='/assets/stylesheets/style.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/stylesheets/fonts.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/font-awesome/css/font-awesome.min.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/leaflet/leaflet.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/leaflet-draw/leaflet.draw.css'][rel='stylesheet'][type='text/css']")
    ]),
    m("body", attrs, modals.concat(app.navbar(ctrl), content))
  ])
}

app.navbar = function(ctrl){

  return m("nav.top-bar[data-topbar]", [
    m("ul.title-area", [
      m("li.name", [
        m("h1", [
          m("a", {href: "/requests", config: m.route}, "Open Reconstruction")
        ])
      ])
    ]),
    m("section.top-bar-section", [
      m("ul.left", [
        m("li", [
          m("a", {href: "/dashboard", config: m.route}, "Dashboard")
        ]),
        m("li", [
          m("a", {href: "/requests", config: m.route}, "Requests")
        ]),
        ctrl.currentUser() && ctrl.currentUser().agency ?
          m("li", [
            m("a", {href: "/agencies/" + ctrl.currentUser().agency.id, config: m.route}, 
              ctrl.currentUser().agency.role == "LGU" ? "My LGU" : "My Agency")
          ])
        : "",
        ctrl.currentUser() && ctrl.currentUser().isSuperAdmin ?
          m("li", [
            m("a", {href: "/admin", config: m.route}, "Admin")
          ])
        : ""
      ]),
      m("ul.right", [
        m("li.has-dropdown.not-click", [
          m("a", {href: "#"}, [
            m.cookie().logged_in ? 
              m("span", [
                m.cookie().logged_in,
                m("span.label", [
                  ctrl.currentUser().agency.acronym ? ctrl.currentUser().agency.acronym : ctrl.currentUser().agency.name
                ]),
              ])
            : "Guest"
          ]),
          m("ul.dropdown", [
            m.cookie().logged_in ?
              m("li", [
                m("a", {href: "/logout"}, "Log out")
              ])
            : m("li", [
                m("a", {href: "/login", config: m.route}, "Log in")
              ])
          ])
        ])
      ])
    ])
  ]);
}
