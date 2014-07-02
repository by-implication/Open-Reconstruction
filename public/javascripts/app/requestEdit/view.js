requestEdit.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Edit Legacy Request — " + ctrl.request().description,
    {className: "detail"},
    [
    	m("h1", "Editing Legacy Request"),
    	m("form", {onsubmit: ctrl.submit}, [
	    	common.field("Status",
	    		select2.view({data: process.levelDict.map(function (l, i){
	    			return {id: i, name: l};
	    		}), value: ctrl.status(), onchange: ctrl.status})
	  		),
	    	common.dateField("Date Received", ctrl.date, ctrl.htmlDate),
	    	common.field("SARO No.",
	    		m("input", {value: ctrl.saroNo(), onchange: m.withAttr("value", ctrl.saroNo)})
	  		),
	  		m("button", "Submit"),
	  		m("a.alert.button", {href: routes.controllers.Requests.view(ctrl.id).url}, "Cancel")
  		])
    ]
  );

}
