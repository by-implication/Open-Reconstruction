var visualizations = {
  library: {}
};

visualizations.create = function(title, id, type, chartSettingsCreator){
  visualizations.library[id] = function(ctrl){
    var visCtrl = new visPanel.controller();
    visCtrl.title(title);
    visCtrl.link(id);
    visCtrl.type(type);
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
  'request',
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
  'Request Type Distribution',
  'projectTypes',
  'request',
  function(ctrl){
    return function(){
      var data = _.chain(ctrl.byProjectType())
        .sortBy(function(t){
          return t.count * -1;
        })
        .value();
      var counts = data.map(function(t){
        return t.count;
      });
      var types = data.map(function(t){
        return t.name;
      });
      return {
        data: {
          columns: [
            ["Number of Projects"].concat(counts)
          ],
          type: "bar",
        },
        axis: {
          x: {
            type: "categorized",
            categories: types
          },
          rotated: true
        }
      }
    }
  }
)

visualizations.create(
  'Request History by Disaster Type', 
  'disasterHistory', 
  'request',
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
  'Number of Requests per Unique Named Disaster',
  'topDisasters',
  'request',
  function(ctrl){
    return function(){
      var data = _.chain(ctrl.byNamedDisaster())
        .sortBy(function(d){
          return d.count * -1;
        })
        .take(5)
        .value();
      var counts = data.map(function(d){
        return d.count / 1;
      });
      var cats = data.map(function(d){
        if (d.name) {
          if (d.name.length > 12) {
            return _.chain(d.name)
              .take(12)
              .reduce(function(a, b){
                return a + b;
              })
              .value();
          };
          return d.name;
        } else {
          return "unnamed";
        }
      });
      return {
        data: {
          columns: [
            ["Number of Requests"].concat(counts)
          ],
          type: "bar",
        },
        axis: {
          x: {
            type: "categorized",
            categories: cats
          },
          rotated: true
        }
      }
    }
  }
)

visualizations.create(
  'Request Amounts per Unique Named Disaster',
  'topDisastersAmount',
  'request',
  function(ctrl){
    return function(){
      var data = _.chain(ctrl.byNamedDisaster())
        .sortBy(function(d){
          return d.amount * -1;
        })
        .take(5)
        .value();
      var amounts = data.map(function(d){
        return d.amount / 1;
      });
      var cats = data.map(function(d){
        if (d.name) {
          if (d.name.length > 12) {
            return _.chain(d.name)
              .take(12)
              .reduce(function(a, b){
                return a + b;
              })
              .value();
          };
          return d.name;
        } else {
          return "unnamed";
        }
      });
      return {
        data: {
          columns: [
            ["Number of Requests"].concat(amounts)
          ],
          type: "bar"
        },
        axis: {
          x: {
            type: "categorized",
            tick: {
              rotate: 75
            },
            categories: cats,
          },
          y: {
            
          },
          rotated: true
        }
      }
    }
  }
)
