var viz = {
  library: {}
};

viz.create = function(title, id, type, chartSettingsCreator, sorts){
  viz.library[id] = function(ctrl){
    var visCtrl = new visPanel.controller();
    visCtrl.title(title);
    visCtrl.link(id);
    visCtrl.type(type);
    visCtrl.chartSettings = chartSettingsCreator.bind(this, ctrl);
    if(!_.isUndefined(sorts)){
      visCtrl.sorts(sorts);
    }
    return visCtrl;
  }
}

viz.parseYearMonth = function(yearMonth){
  var ym = yearMonth.split("-");
  var y = parseInt(ym[0]);
  var m = parseInt(ym[1]);
  return {
    year: y,
    month: m,
    yearMonth: yearMonth
  }
}

viz.genYearMonth = function(start, end){
  var s = viz.parseYearMonth(start);
  var e = viz.parseYearMonth(end);

  return _.chain(s.year)
    .range(e.year + 1)
    .map(function(y, index){
      // if the first, then get s.month to (12 + 1)
      // if the last, then get 1 to (e.month + 1)
      // if the first === last, then get s.month to e.month
      var lastIndex = e.year - s.year;
      var firstIndex = 0;
      var monthRange = [];

      if (lastIndex === firstIndex) {
        monthRange = _.range(s.month, e.month + 1);
      } else if (index === firstIndex) {
        monthRange = _.range(s.month, 13);
      } else if (index === lastIndex) {
        monthRange = _.range(1, e.month + 1);
      } else {
        monthRange = _.range(1, 13);
      }

      return monthRange.map(function(m){
        return y + "-" + helper.pad(m);
      })
    })
    .flatten()
    .value()
}

viz.nextYearMonth = function nextYearMonth(yearMonth){
  var ym = yearMonth.split("-");
  var y = parseInt(ym[0]);
  var m = parseInt(ym[1], 10);
  m++;
  if(m > 12){
    m = 1;
    y++;
  }
  return y + "-" + (m < 10 ? "0" + m : m);
}

viz.padMonths = function padMonths(a){
  a = a.sort(function (a, b){
    if ( a.yearMonth < b.yearMonth )
      return -1;
    if ( a.yearMonth > b.yearMonth )
      return 1;
    return 0;
  });
  var r = [];
  for(var ym = a[0] && a[0].yearMonth; a.length; ym = viz.nextYearMonth(ym)){
    var nextElem = {yearMonth: ym, amount: 0, count: 0};
    while(a[0] && a[0].yearMonth == ym){
      nextElem = a.shift();
    }
    r.push(nextElem);
  }
  return r;
}

viz.zeroDatapoint = function(datapoint, date){
  var keys = _.keys(datapoint);
  var values = keys.map(function(d){
    if (d == "yearMonth") {
      return date
    } else {
      return null
    }
  });
  return _.object(keys, values);
}

viz.padMonths2 = function (data){
  data = _.sortBy(data, "yearMonth")
  var r = [];
  var range = viz.genYearMonth(data[0].yearMonth, _.last(data).yearMonth);

  var dataDict = _.groupBy(data, "yearMonth")
  return range.map(function(d){
    var dPoint = dataDict[d];
    if (!_.isUndefined(dPoint)){
      return dPoint[0];
    } else {
      return viz.zeroDatapoint(data[0], d);
    }
  })
}

viz.History = function(){

}

viz.Distribution = function(){

}

// viz.create(
//   "Average Residence Time Per Project Stage",
//   "projectResidenceTime",
//   "project",
//   function(ctrl){

//     var oneDay = 1000*60*60*24;
//     var aveDur = ctrl.eplc().aveDur;
//     var labels = [];
//     var durTimes = [];
//     for(var name in aveDur){
//       labels.push(name);
//       durTimes.push(aveDur[name] / oneDay);
//     }

//     return {
//       data: {
//         columns: [
//           ["Average Residence Time per Project Activity"].concat(durTimes)
//         ],
//         type: "bar"
//       },
//       axis: {
//         x: {
//           label: {
//             text: "Project Activities",
//             position: "outer-middle"
//           },
//           type: "categorized",
//           categories: labels
//         },
//         y: {
//           label: {
//             text: "Days",
//             position: "outer-center"
//           },
//           // tick: {
//           //   format: function(t){
//           //     return t + " days";
//           //   }
//           // }
//         },
//         rotated: true
//       }
//     }
//   }
// )

viz.create(
  "Project Count and Amount, Distributed by Agency",
  "projectCountAmountAgency",
  "project",
  function(ctrl){
    var byAgency = _.sortBy(ctrl.projects().byAgency(), "count").reverse();
    return {
      size: {
        height: 400,
        fullViewHeight: 600
      },
      data: {
        json: byAgency,
        keys: {
          x: "name",
          value: ["name", "count", "amount"]
        },
        axes: {
          "count": "y",
          "amount": "y2"
        },
        type: "bar"
      },
      axis: {
        y: {
          label: {
            text: "Number of Projects",
            position: "outer-center"
          }
        },
        x: {
          type: 'category',
          label: {
            text: "Agency",
            position: "outer-middle"
          }
        },
        y2: {
          show: true,
          tick: {
            format: function(t){
              return helper.truncate(t, 2);
            }
          },
          label: {
            text: "Amount in PHP",
            position: "outer-center"
          },
          padding: {
            bottom: 0
          }
        },
        rotated: true
      }
    }
  },
  ["count", "amount"]
)

viz.create(
  "Project Type Distribution",
  "projectTypeDistribution",
  "project",
  function(ctrl){
    var byType = ctrl.projects().byType;
    console.log(byType);
    return {
      data: {
        json: byType,
        keys: {
          x: "projectType",
          value: ["disaster"]
        },
        type: "bar"
      },
      axis: {
        x: {
          type: "category",
          label: {
            text: "Project Types",
            position: "outer-middle"
          }
        },
        y: {
          label: {
            text: "Number of Projects",
            position: "outer-center"
          }
        },
        rotated: true
      }
    }
  }
)

viz.create(
  'Project Count and Amount History',
  'projectCountHistory',
  'project',
  function(ctrl){

    var byMonth = viz.padMonths(ctrl.projects().byMonth).map(function(d){
      return {
        date: new Date(d.yearMonth),
        count: d.count,
        amount: d.amount * 1000
      }
    });

    return {
      data: {
        json: byMonth,
        keys: {
          x: "date",
          value: ["date", "count", "amount"]
        },
        axes: {
          "count": "y",
          "amount": "y2"
        },
        types: {
          "count": "bar"
        }
      },
      axis: {
        y: {
          label: {
            text: "Number of Projects",
            position: "outer-middle"
          }
        },
        x: {
          type: 'timeseries',
          tick: {
            format: '%b, %Y',
            culling: {
              max: 4
            }
          },
          label: {
            text: "Date",
            position: "outer-center"
          }
        },
        y2: {
          show: true,
          tick: {
            format: function(t){
              return helper.truncate(t, 2);
            }
          },
          label: {
            text: "Amount in PHP",
            position: "outer-middle"
          },
          padding: {
            bottom: 0
          }
        }
      }
    }
  }
)

viz.create(
  'SARO Count and Amount Distribution by Agency',
  'saroCountAmountAgency',
  'saro',
  function(ctrl){
    var byAgency = _.sortBy(ctrl.saros().byAgency, "count").reverse();

    return {
      size: {
        height: 400,
        fullViewHeight: 600
      },
      data: {
        json: byAgency,
        keys: {
          x: "agency",
          value: ["agency", "count", "amount"]
        },
        axes: {
          "count": "y",
          "amount": "y2"
        },
        type: "bar"
      },
      axis: {
        x: {
          type: "category",
          label: {
            text: "Agency",
            position: "outer-middle"
          }
        },
        y: {
          label: {
            text: "Number of SAROs assigned",
            position: "outer-center"
          }
        },
        y2: {
          show: true,
          tick: {
            format: function(t){
              return helper.truncate(t, 2);
            }
          },
          label: {
            text: "Amount in PHP",
            position: "outer-center"
          }
        },
        rotated: true
      }
    }
  }
)

viz.create(
  'SARO Count and Amount History',
  'saroHistory',
  'saro',
  function(ctrl){
    var byMonth = viz.padMonths(ctrl.saros().byMonth).map(function(d){
      return {
        date: new Date(d.yearMonth),
        amount: d.amount,
        count: d.count
      }
    });

    return {
      data: {
        json: byMonth,
        keys: {
          x: "date",
          value: ["date", "count", "amount"]
        },
        axes: {
          "count": "y",
          "amount": "y2"
        },
        types: {
          "count": "bar"
        },
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%b, %Y',
            culling: {
              max: 4
            }
          },
          label: {
            text: "Date",
            position: "outer-center"
          }
        },
        y: {
          label: {
            text: "Quantity",
            position: "outer-middle"
          }
        },
        y2 : {
          show: true,
          tick: {
            format: function(t){
              return helper.truncate(t, 2);
            }
          },
          padding: {
            bottom: 0
          },
          label: {
            text: "Amount in PHP",
            position: "outer-middle"
          },
        }
      }
    }
  }
)

viz.create(
  'Request Count and Amount per Unique Named Disaster',
  'topDisasters',
  'request',
  function(ctrl){
    var byDisaster = _.sortBy(ctrl.requests().byNamedDisaster(), "count").reverse();
    return {
      data: {
        json: byDisaster,
        keys: {
          x: "name",
          value: ["name", "count", "amount"]
        },
        axes: {
          "count": "y",
          "amount": "y2"
        },
        type: "bar",
      },
      axis: {
        x: {
          type: "category",
          label: {
            text: "Disaster",
            position: "outer-middle"
          }
        },
        y: {
          label: {
            text: "Count",
            position: "outer-center"
          }
        },
        y2: {
          show: true,
          tick: {
            format: function(t){
              return helper.truncate(t, 2);
            }
          },
          label: {
            text: "Amount in PHP",
            position: "outer-center"
          },
        },
        rotated: true,
      },
    }
  }
)

viz.create(
  'Request Type Distribution',
  'projectTypes',
  'request',
  function(ctrl){
    var byType = _.chain(ctrl.requests().byProjectType())
      .sortBy("count")
      .reverse()
      .value();
    return {
      size: {
        height: 400,
        fullViewHeight: 600
      },
      data: {
        json: byType,
        keys: {
          x: "projectTypeName",
          value: ["boholQty", "yolandaQty"],
        },
        type: "bar"
      },
      axis: {
        x: {
          type: "category",
          label: {
            text: "Request Types",
            position: "outer-middle"
          }
        },
        y: {
          label: {
            text: "Number of Requests",
            position: "outer-center"
          }
        },
        rotated: true
      }
    }
  }
)

viz.create(
  'Request Count and Amount History',
  'requestHistory',
  'request',
  function(ctrl){
    var byMonth = ctrl.requests().byMonth().map(function(d){
      return {
        date: new Date(d.yearMonth),
        amount: d.amount / 1,
        count: d.count
      }
    });
   
    return {
      data: {
        json: byMonth,
        keys: {
          x: "date",
          value: ["date", "count", "amount"]
        },
        axes: {
          "count": 'y',
          "amount": 'y2'
        },
        types: {
          "count": 'bar',
        }
      },
      axis : {
        x : {
          label: {
            text: "Date",
            position: "outer-center"
          },
          type : 'timeseries',
          tick: {
            format: '%b, %Y',
            culling: {
              max: 4
            }
          }
        },
        y: {
          label: {
            text: "Number of Requests",
            position: "outer-middle"
          }
        },
        y2 : {
          label: {
            text: "Amount in PHP",
            position: "outer-middle"
          },
          show: true,
          tick: {
            format: function(t){
              return "PHP " + helper.truncate(t, 2);
            }
          },
          padding: {
            bottom: 0
          }
        },
      }
    }
  }
)

viz.create(
  'Request History by Disaster Type', 
  'disasterHistory', 
  'request',
  function(ctrl){

    var disasters = _.chain(ctrl.requests().byDisasterType())
      .groupBy("disasterType")
      .keys()
      .value();

    var proto = _.chain(ctrl.requests().byDisasterType())
      .groupBy(function(p){ return p.yearMonth; })
      .map(function(d, k){ return { yearMonth: k, data: d } })
      .value();

    var data2 = viz.padMonths2(proto).map(function(datapoint){
      var keys = disasters.concat("yearMonth");
      var values = disasters.map(function(dis){
        // look at each disaster from the set of all available disasters
        if(datapoint.data){
          // does the datapoint data exist?
          var disInData = _(datapoint.data).find(function(d){
            return d.disasterType === dis;
          })
          // grouped by disaster type for easy access
          if (!_(disInData).isUndefined()) {
            return disInData.count;
            // access the data for that disaster if it exists
          } else {
            // data for that disaster doesn't exist.
            return 0;
          }
        } else {
          return 0;
        }
      }).concat(new Date(datapoint.yearMonth));

      return _.object(keys, values);
    });

    return {
      data: {
        json: data2,
        keys: {
          x: "yearMonth",
          value: disasters.concat("yearMonth")
        },
        type: 'area',
        groups: [
          disasters
        ]
      },
      axis: {
        y: {
          label: {
            text: "Number of Requests",
            position: "outer-middle"
          }
        },
        x : {
          type : 'timeseries',
          label: {
            text: "Date",
            position: "outer-center"
          },
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
)
