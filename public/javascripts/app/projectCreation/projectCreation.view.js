projectCreation.view = function(ctrl){

  function cancel(){ history.back(); }

  function scopeLabel(scope){
    switch(scope){
      case "Reconstruction": return "Completely destroyed, and we need to rebuild it";
      case "Repair": return "Partially damaged, and we need to repair it";
      case "Prevention": return "Does not currently exist, and we need to build it for prevention";
      default: return scope;
    }
  }

  var sections = [
    {
      icon: "fa-cloud",
      content: [
        m("h2", "Disaster"),
        common.field(
          "Type",
          m("select", {onchange: m.withAttr("value", ctrl.input.disasterType)}, ctrl.requestCreationInfo.disasterTypes.map(function(e){return m("option", e)}))
        ),
        common.field(
          "Date",
          m("div.row", [
            m("div.columns.medium-4", [
              m("select#disaster-month", {onchange: ctrl.updateDateField}, [
                _.range(0, 12).map(function(month){
                  return m("option", {value: month+1}, helper.monthArray[month]);
                })
              ])
            ]),
            m("div.columns.medium-4", [
              m("select#disaster-day", {onchange: ctrl.updateDateField}, [
                _.range(1, 32).map(function(day){
                  return m("option", day);
                })
              ])
            ]),
            m("div.columns.medium-4", [
              m("select#disaster-year", {onchange: ctrl.updateDateField}, [
                _.range(2001, 2015).map(function(year){
                  return m("option", year);
                })
              ])
            ])
          ])
        ),
        common.field(
          "Name",
          m("input", {onchange: m.withAttr("value", ctrl.input.disasterName), type: 'text', placeholder: 'Yolanda, Pepeng, Piping, Popong, etc...'}),
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
          m("input", {onchange: m.withAttr("value", ctrl.input.description), type: "text", placeholder: "e.g. Reconstruction of a seawall for barangay A"}),
          "Please make sure that the description is as specific as can be."
        ),
        common.field(
          "Estimated Amount",
          m("input", {type: "number", onchange: m.withAttr("value", ctrl.input.amount)}),
          "Note that the agency assigned to evaluate this request may change the amount based on their costing."
        ),
        console.log(ctrl.requestCreationInfo.projectTypes),
        common.field(
          "Type",
          m("select", {
            onchange: m.withAttr("value", ctrl.input.projectType), 
            value: ctrl.input.projectType()
          }, [
            m("optgroup", {label: "Water"}, [
              m("option", ctrl.requestCreationInfo.projectTypes[0]),
              m("option", ctrl.requestCreationInfo.projectTypes[1]),
              m("option", ctrl.requestCreationInfo.projectTypes[2]),
              m("option", ctrl.requestCreationInfo.projectTypes[8]),
              m("option", ctrl.requestCreationInfo.projectTypes[13]),
            ]),
            m("optgroup", {label: "Infrastructure"}, [
              m("option", ctrl.requestCreationInfo.projectTypes[4]),
              m("option", ctrl.requestCreationInfo.projectTypes[9]),
            ]),
            m("optgroup", {label: "Buildings"}, [
              m("option", ctrl.requestCreationInfo.projectTypes[5]),
              m("option", ctrl.requestCreationInfo.projectTypes[6]),
              m("option", ctrl.requestCreationInfo.projectTypes[10]),
            ]),
          ])
        ),

        m.switch(ctrl.input.projectType())
          .case("Bridge", function(){
            return common.field(
              "Parent Road",
              m("input", {type: "text", placeholder: "Tagbilaran North Road"}),
              "Tell us on which road this bridge is located."
            );
          })
          .case("Agriculture", function(){
            return "agri!";
          })
          .case("Other", function(){
            return "specify!";
          })
          .render(),
        common.field(
          "Scope of Work",
          m("select", {onchange: m.withAttr("value", ctrl.input.scopeOfWork), value: ctrl.input.scopeOfWork()},
            ctrl.requestCreationInfo.projectScopes.map(function (e){
              return m("option", {value: e}, scopeLabel(e))
            })
          ),
          "Do we need to reconstruct this in its entirety? Or is this simply a repair job?"
        ),
        console.log(ctrl.input.location()),
        common.field(
          "Location",
          m("div", {id: "map", config: ctrl.initMap}),
          "Tell us where the project is. If you can, draw a shape encompassing the project, or a line describing a road/bridge."
        )
      ],
      // help: "Now tell us about this project. Please be as brief as you can when describing your project. Making it simple and easy to understand will make your project more likely to be approved."
    },
    {
      content: [
        m("button", "Submit"),
        m("button", {type: "button", class: "alert", onclick: cancel}, "Cancel"),
      ]
    }
  ]

  return app.template(ctrl.app, [
    common.banner("New Project Request"),
    m("form", {onsubmit: ctrl.submitNewRequest },
      sections.map(function(s, i){
        return common.formSection(s.icon, s.content, i);
      })
    )
  ])
}