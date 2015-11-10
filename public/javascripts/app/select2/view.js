/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

select2.view = function(ctrl, additionalOptions){
  var defaultOptions = {
    config: select2.config(ctrl),
    "data-customforms": "disabled"
  }

  var options = _.extend(defaultOptions, additionalOptions)

	if(ctrl.query){
		return m("input", options);
	} else {
	  return m("select", options, ctrl.data.map(function(item){
	    return m("option", {value: item.id}, item.name);
	  }));
	}
}