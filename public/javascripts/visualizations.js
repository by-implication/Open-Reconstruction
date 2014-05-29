var visualizations = {
  library: {}
};

visualizations.create = function(title, id, chartSettingsCreator){
  visualizations.library[id] = function(ctrl){
    var visCtrl = new visPanel.controller();
    visCtrl.title(title);
    visCtrl.link(id);
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
  'Request Count and Amount History',
  'requestHistory',
  function(ctrl){
    return function(){
    var labels = _.pluck(ctrl.byMonth(), 'yearMonth');
    var amountPerMonth = ctrl.byMonth().map(function (e){ return e.amount / 1; });
    var countPerMonth = ctrl.byMonth().map(function (e){ return e.count; });

    return {
      data: {
        x: "x",
        columns: [
          ["x"].concat(labels),
          ["Count per Month"].concat(countPerMonth),
          ["Amount per Month"].concat(amountPerMonth)
        ],
        axes: {
          "Count per Month": 'y',
          "Amount per Month": 'y2'
        },
        types: {
          "Count per Month": 'bar',
        }
      },
      axis : {
        x : {
          type : 'timeseries',
          tick: {
            format: '%b, %Y',
            culling: {
              max: 3
            }
          }
        },
        y2 : {
          show: true,
          tick: {
            format: function(t){
              var format =  d3.format(",")
              return "PHP " + format(t);
            }
          }
        },
      }
    }
  }
  }
)

visualizations.create(
  'Project Type Distribution',
  'projectTypes',
  function(ctrl){
    return function(){
      return {
        data: {
          columns: [
            ["Number of Projects", 3, 15, 82, 1, 42, 23]
          ],
          type: "bar",
        },
        axis: {
          x: {
            type: "categorized",
            categories: ["Rivers", "Infrastructure", "Housing", "Roads", "Phi", "Mark"]
          },
          rotated: true
        }
      }
    }
  }
)

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
              format: '%b, %Y',
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

visualizations.create(
  'Number of Projects per Unique Named Disaster',
  'topDisasters',
  function(ctrl){
    return function(){
      return {
        data: {
          columns: [
            ["Number of Projects", 3, 15, 82, 1, 42, 23]
          ],
          type: "bar",
        },
        axis: {
          x: {
            type: "categorized",
            categories: ["Rivers", "Infrastructure", "Housing", "Roads", "Phi", "Mark"]
          },
          rotated: true
        }
      }
    }
  }
)

visualizations.create(
  'Project Amounts per Unique Named Disaster',
  'topDisastersAmount',
  function(ctrl){
    return function(){
      return {
        data: {
          columns: [
            ["Number of Projects", 3, 15, 82, 1, 42, 23]
          ],
          type: "bar",
        },
        axis: {
          x: {
            type: "categorized",
            categories: ["Rivers", "Infrastructure", "Housing", "Roads", "Phi", "Mark"]
          },
          rotated: true
        }
      }
    }
  }
)