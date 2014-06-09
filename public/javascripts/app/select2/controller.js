select2.config = function(ctrl){
  return function(elem, isInit){
    var el = $(elem);
    el.select2().off("change")
      .on("change", function(e){
        m.startComputation();
        if (typeof ctrl.onchange === "function"){
          console.log('triggered')
          ctrl.onchange(el.select2("val"));
        }
        m.endComputation();
      });
    el.select2("val", ctrl.value);
  }
}