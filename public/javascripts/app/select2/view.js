select2.view = function(ctrl){
  return m("select", {config: select2.config(ctrl), "data-customforms": "disabled"}, ctrl.data.map(function(item){
    return m("option", {value: item.id}, item.name)
  }))
}