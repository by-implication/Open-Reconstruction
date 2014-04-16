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
      m("link[href='assets/stylesheets/style.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='//fonts.googleapis.com/css?family=Roboto+Condensed:400,300,700'][rel='stylesheet'][type='text/css']"),
      m("link[href='assets/bower_components/font-awesome/css/font-awesome.min.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='assets/bower_components/leaflet/leaflet.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='assets/bower_components/leaflet-draw/leaflet.draw.css'][rel='stylesheet'][type='text/css']")
    ]),
    m("body", attrs, [app.navbar(ctrl)].concat(content))
  ])
}

app.navbar = function(ctrl){

  var menuItems = [
    {label: "Overview", url: "/dashboard"},
    {label: "Projects", url: "/projects"}
  ]

  var menuItem = function(data){
    if(!data.url) data.url = "#";
    return m("li", [m("a", {href: data.url, config: m.route}, data.label)]);
  }

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
        menuItems.map(menuItem)
      ]),
      m("ul.right", [
        m("li.has-dropdown.not-click", [
          m("a", {href: "#"}, [
            helper.selfun(function(){
              if(ctrl.app.isLoggedIn()){
                return ctrl.app.getLoggedIn().name;
              } else {
                return "Guest";
              }
            })
          ]),
          m("ul.dropdown", [
            ctrl.app.authorizedUsers().map(function(user){
              return m("li", [
                m("a", {onclick: function(){
                  ctrl.app.login(user)
                }}, user.name)
              ])
            }),
            helper.selfun(function(){
              if(ctrl.app.isLoggedIn()){
                return m("li", [
                  m("a", {onclick: ctrl.app.logout.bind(ctrl.app)}, "Logout")
                ])
              }
            })
          ])
        ])
      ])
    ])
  ]);
}