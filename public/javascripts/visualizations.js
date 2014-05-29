var visualizations = {
  library: {}
};

// Inner function creates
// Create function adds creator to library
// From outer ctrl, call function

visualizations.create = function(title, id, chartSettingsCreator){
  visualizations.library[id] = function(ctrl){
    var visCtrl = new visPanel.controller();
    visCtrl.title(title);
    visCtrl.link(id);
    console.log('called from the library');
    console.log(ctrl);
    visCtrl.chartSettings = chartSettingsCreator(ctrl);
    return visCtrl;
  }

}

visualizations.nextYearMonth = function nextYearMonth(yearMonth){
  var ym = yearMonth.split("-");
  var y = parseInt(ym[0]);
  var m = parseInt(ym[1]);
  m++;
  if(m > 12){
    m = 1;
    y++;
  }
  return y + "-" + (m < 10 ? "0" + m : m);
}

visualizations.padMonths = function padMonths(a){
  var r = [];
  for(var ym = a[0].yearMonth; a.length; ym = visualizations.nextYearMonth(ym)){
    var nextElem = {yearMonth: ym, amount: 0, count: 0};
    if(a[0].yearMonth == ym){
      nextElem = a.shift();
    }
    r.push(nextElem);
  }
  return r;
}

visualizations.create(
  'Project History by Type', 
  'disasterHistory', 
  function(ctrl){

    return function(){
      var data = _.chain(ctrl.byDisasterType())
        .groupBy(function(p){
          return p.disasterTypeId;
        })
        .map(function(subData, key){
          return [key].concat(visualizations.padMonths(subData).map(function(d){
            return d.count
          }));
        })
        .value();

      var range = visualizations.padMonths(ctrl.byDisasterType()).map(function(d){
        return d.yearMonth;
      });

      return {
        data: {
          x: "x",
          columns: [["x"].concat(range)].concat(data),
          type: 'area',
          groups: [
            ["Disaster 1"]
          ]
        },
        axis: {
          x : {
            type : 'timeseries',
            tick: {
              format: function (x) { 
                var monthDict = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return monthDict[x.getMonth()] + ", " + x.getFullYear(); 
              },
              culling: {
                max: 4
              }
            }
          },
        }
      }
    }
  }
)