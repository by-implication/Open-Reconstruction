app.template = function(a, b, c){
  var ctrl, attrs, content;

  if(arguments.length === 2){
    ctrl = arguments[0];
    content = arguments[1];
    attrs = {class: ""};
  } else if (arguments.length === 3){
    ctrl = arguments[0];
    attrs = arguments[1];
    content = arguments[2];
  }

  return m("html", [
    m("head", [
      m("link[href='/assets/stylesheets/style.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='//fonts.googleapis.com/css?family=Roboto+Condensed:400,300,700'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/font-awesome/css/font-awesome.min.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/leaflet/leaflet.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='/assets/bower_components/leaflet-draw/leaflet.draw.css'][rel='stylesheet'][type='text/css']")
    ]),
    m("body", attrs, [app.navbar(ctrl)].concat(content))
  ])
}

app.navbar = function(ctrl){

  return m("nav.top-bar[data-topbar]", [
    m("ul.title-area", [
      m("li.name", [
        m("h1", [
          m("a[href='#']", "Open Reconstruction")
        ])
      ])
    ]),
    m("section.top-bar-section", [
      m("ul.left", [
        m("li", [
          m("a", {href: "/dashboard", config: m.route}, "Dashboard")
        ]),
        m("li", [
          m("a", {href: "/projects", config: m.route}, "Projects")
        ]),
        ctrl.currentUser() && ctrl.currentUser().agency ?
          m("li", [
            m("a", {href: "/agencies/" + ctrl.currentUser().agency.id}, "My Agency")
          ])
        : null,
        ctrl.currentUser() && ctrl.currentUser().isSuperAdmin ?
          m("li", [
            m("a", {href: "/admin", config: m.route}, "Admin")
          ])
        : null
      ]),
      m("ul.right", [
        m("li.has-dropdown.not-click", [
          m("a", {href: "#"}, [
            m.if(m.cookie().logged_in, m.cookie().logged_in),
            m.if(!m.cookie().logged_in, "Guest")
          ]),
          m("ul.dropdown", [
            m.if(m.cookie().logged_in, 
              m("li", [
                m("a", {href: "/logout"}, "Log out")
              ]),
              m("li", [
                m("a", {href: "/login", config: m.route}, "Log in")
              ])
            ),
          ])
        ])
      ])
    ])
  ]);
}