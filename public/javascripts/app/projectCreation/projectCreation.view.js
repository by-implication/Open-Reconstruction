projectCreation.view = function(ctrl){

  var sections = [
    {
      icon: "fa-cloud",
      content: [
        m("h2", "Disaster"),
        common.field(
          "Type",
          m("select", ["Typhoon", "Earthquake", "Flood", "Fire", "Other"].map(function(e){return m("option", e)}))
        ),
        common.field(
          "Date",
          m("div.row", [
            m("div.columns.medium-4", [
              m("select", [
                _.range(0, 12).map(function(month){
                  return m("option", helper.monthArray[month]);
                })
              ])
            ]),
            m("div.columns.medium-4", [
              m("select", [
                _.range(1, 32).map(function(day){
                  return m("option", day);
                })
              ])
            ]),
            m("div.columns.medium-4", [
              m("select", [
                _.range(2001, 2015).map(function(year){
                  return m("option", year);
                })
              ])
            ])
          ])
        ),
        common.field(
          "Name",
          m("input", {type: 'text', placeholder: 'Yolanda, Pepeng, Piping, Popong, etc...'}),
          "Only if it applies. Please be careful with spelling."
        )
      ],
      // help: "Specify the disaster to give everyone context about your request. Insert all these other details etc..."
    },
    {
      icon: "fa-briefcase",
      content: [
        m("h2", "Basic Information"),
        common.field(
          "Description",
          m("input", {type: "text", placeholder: "Seawall for this town"}),
          "This is what everyone will see. Keep it short and clear."
        ),
        common.field(
          "Type",
          m("select", {onchange: m.withAttr("value", ctrl.projectType), value: ctrl.projectType()}, ["Road", "Bridge", "Public Building", "School Building"].map(function(e){return m("option", e)}))
        ),
        m.if(
          ctrl.projectType() == "Bridge",
          common.field(
            "Parent Road",
            m("input", {type: "text", placeholder: "Tagbilaran North Road"}),
            "Tell us on which road this bridge is located."
          )
        ),
        common.field(
          "Amount",
          m("input", {type: "number"})
        ),
        common.field(
          "Scope of Work",
          m("select", {onchange: m.withAttr("value", ctrl.scopeOfWork), value: ctrl.scopeOfWork()}, ["Reconstruction", "Repair and Rehabilitation", "Other"].map(function(e){return m("option", e)})),
          "Do we need to reconstruct this in its entirety? Or is this simply a repair job?"
        ),
        common.field(
          "Location",
          m("div", {id: "map", config: ctrl.initMap}),
          "Tell us where the project is. If you can, draw a shape encompassing the project, or a line describing a road/bridge."
        )
      ],
      // help: "Now tell us about this project. Please be as brief as you can when describing your project. Making it simple and easy to understand will make your project more likely to be approved."
    },
    // {
    //   icon: "fa-paperclip",
    //   content: [
    //     m("h2", "Attachment"),
    //     m("h3", "Endorsements"),
    //     m("button", {type: "button"}, "Upload"),
    //     m("h3", "Costing Estimates"),
    //     m("button", {type: "button"}, "Upload"),
    //     m("h3", "Inspection Reports"),
    //     m("button", {type: "button"}, "Upload"),
    //     m("h3", "Photos/Diagrams"),
    //     m("button", {type: "button"}, "Upload"),
    //     m("h3", "Other"),
    //     m("button", {type: "button"}, "Upload"),
    //   ],
    //   // help: "We need your attachments to help your case. Certificates from engineers, endorsements from politicians, and photographs of the area are extremely helpful."
    // },
    {
      content: [
        m("button", {type: "button"}, "Submit"),
        m("button", {type: "button", class: "alert"}, "Cancel"),
      ]
    }
  ]

  return app.template(ctrl, [
    common.banner("New Project Request"),
    m("form", 
      sections.map(function(s, i){
        return common.formSection(s.icon, s.content, i);
      })
    )
  ])
}