select2.config = function(ctrl){
  return function(elem, isInit){
    var el = $(elem);
    if (!isInit) {
      el.select2()
        .on("change", function(e){
          m.startComputation();
          if (typeof ctrl.onchange === "function") ctrl.onchange(el.select2("val"));
          m.endComputation();
        });
    };
    el.select2("val", ctrl.value);
  }
}