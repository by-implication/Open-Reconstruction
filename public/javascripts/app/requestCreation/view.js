requestCreation.view = function(ctrl){

  function cancel(){ history.back(); }

  function scopeLabel(scope){
    switch(scope){
      case "Reconstruction": return "Completely destroyed, and we need to rebuild it";
      case "Repair": return "Partially damaged, and we need to repair it";
      case "Prevention": return "Does not currently exist, and we need to build it for prevention";
      default: return scope;
    }
  }

  function projectTypeGroups(indexArr){
    return indexArr.map(function (i){
      var projectType = ctrl.info().projectTypes[i];
      return m("option", {value: projectType.id}, projectType.name);
    });
  }

  var sections = [
    {
      icon: "fa-cloud",
      content: [
        m("h2", "Disaster"),
        common.field(
          "Type",
          m("select", {onchange: m.withAttr("value", ctrl.input.disasterTypeId)},
            ctrl.info().disasterTypes.map(function (e){
              return m("option", {value: e.id}, e.name);
            })
          )
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
          ]),
          null,
          true
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
        common.field(
          "Type",
          m("select", {
            onchange: m.withAttr("value", ctrl.input.projectTypeId),
            value: ctrl.input.projectTypeId()
          }, [
            m("optgroup", {label: "Infrastructure"}, [
              projectTypeGroups([0, 10])
            ]),
            m("optgroup", {label: "Water"}, [
              projectTypeGroups([5, 7, 8, 9, 12, 13])
            ]),
            m("optgroup", {label: "Buildings"}, [
              projectTypeGroups([1, 3, 6, 11])
            ]),
            m("optgroup", {label: "Other"}, [
              projectTypeGroups([2, 4, 14])
            ]),
          ])
        ),

        m.switch(ctrl.input.projectTypeId())
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
          "Location",
          m("div", {id: "map", config: ctrl.initMap}),
          "Tell us where the project is. Use the pin icon on the left side of the map (below the zoom controls) to place a pin on the map."
        )
      ],
      // help: "Now tell us about this project. Please be as brief as you can when describing your project. Making it simple and easy to understand will make your project more likely to be approved."
    },
    {
      icon: "fa-paperclip",
      content: [
        m("h2", "Attachments"),
        m(".header", [
          m("h1", ["Images"]),
        ]),
        m(".content", [
          m("div#imageDropzone.dropzone", {config: ctrl.initImageDropzone}),
          ctrl.attachments().imgs.length ?
            m("ul.attachments-images.small-block-grid-4", ctrl.attachments().imgs.map(function (img){
              return m("li", [
                m("img", {src: routes.controllers.Attachments.bucketThumb(img.key, "img", img.filename).url}),
                m(".filename", [
                  m("a", {title: "Preview", href: routes.controllers.Attachments.bucketPreview(img.key, "img", img.filename).url, target: "_blank"}, [
                    img.filename
                  ]),
                ]),

                m(".uploader", [
                  "Uploaded by ",
                  m("a", {href: routes.controllers.Users.view(img.uploader.id).url, config: m.route},[
                    img.uploader.name
                  ]),
                  m(".date", [
                    helper.timeago(new Date(img.dateUploaded)),
                  ]),
                ])
              ]);
            }))
          : m("h3.empty", [
            "No images have been uploaded yet."
          ])
        ]),
        m(".header", [
          m("h1", ["Documents"]),
        ]),
        m(".content", [
          m("div.dropzone", {config: ctrl.initDocDropzone}),
          ctrl.attachments().docs.length ?
            m("table.doc-list", [
              m("thead", [
                m("tr", [
                  m("td", "Filename"),
                  m("td", "Date Uploaded"),
                  m("td", "Uploader"),
                  m("td", "Actions")
                ])
              ]),
              m("tbody", [
                ctrl.attachments().docs.map(function (doc){
                  return m("tr", [
                    m("td", doc.filename),
                    m("td", common.displayDate(doc.dateUploaded)),
                    m("td", [
                      m("a", {href: routes.controllers.Users.view(doc.uploader.id).url, config: m.route}, doc.uploader.name)
                    ]),
                    m("td", [
                      m("a", {title: "Preview", href: routes.controllers.Attachments.bucketPreview(doc.key, "doc", doc.filename).url, target: "_blank"}, [
                        m("i.fa.fa-lg.fa-fw.fa-eye"),
                      ]),
                      m("a", {title: "Download", href: routes.controllers.Attachments.bucketDownload(doc.key, "doc", doc.filename).url}, [
                        m("i.fa.fa-lg.fa-fw.fa-download"),
                      ])
                    ])
                  ])
                })
              ])
            ])
          : m("h3.empty", [
            "No documents have been uploaded yet."
          ])
        ])
      ]
    },
    {
      content: [
        m("button", {disabled: ctrl.submitButtonDisabled(), onclick: function(e){
          ctrl.submitButtonDisabled(true);
          ctrl.submitNewRequest(e);
        }}, "Submit"),
        m("button", {type: "button", class: "alert", onclick: cancel}, "Cancel"),
      ]
    }
  ]

  return app.template(ctrl.app, [
    common.banner("New Project Request"),
    m("form", {onsubmit: ctrl.submitNewRequest }, [
      common.formSection("fa-star", [
        m("h2", ["Preamble"]),
        common.field(
          "Terms of Agreement",
          m("div", [
            m("input", {type: "checkbox", onchange: m.withAttr("checked", ctrl.preamble)}),
            m("span", [
              "I have not requested for assistance for this project from any other source."
            ])
          ])
        )
      ]),
      ctrl.preamble() ?
        m("div", sections.map(function(s, i){
          return common.formSection(s.icon, s.content, i + 1);
        }))
      : ""
    ])
  ])
}