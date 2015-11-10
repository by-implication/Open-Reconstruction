/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

select2.config = function(ctrl){
  return function(elem, isInit){
    var el = $(elem);
    el.select2({
      query: ctrl.query,
      initSelection: ctrl.initSelection,
      minimumInputLength: ctrl.minimumInputLength
    }).off("change")
      .on("change", function(e){
        m.startComputation();
        if (typeof ctrl.onchange === "function"){
          ctrl.onchange(el.select2("data"));
        }
        m.endComputation();
      });
    el.select2("val", ctrl.value);
  }
}