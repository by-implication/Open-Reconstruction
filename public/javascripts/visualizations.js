var visualizations = {
  library: {}
};

visualizations.create = function(title, id, type, chartSettingsCreator){
  visualizations.library[id] = function(ctrl){
    var visCtrl = new visPanel.controller();
    visCtrl.title(title);
    visCtrl.link(id);
    visCtrl.type(type);
    visCtrl.chartSettings = chartSettingsCreator.bind(this, ctrl);
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
  a = a.sort(function (a, b){
    if ( a.yearMonth < b.yearMonth )
      return -1;
    if ( a.yearMonth > b.yearMonth )
      return 1;
    return 0;
  });
  var r = [];
  for(var ym = a[0] && a[0].yearMonth; a.length; ym = visualizations.nextYearMonth(ym)){
    var nextElem = {yearMonth: ym, amount: 0, count: 0};
    while(a[0] && a[0].yearMonth == ym){
      nextElem = a.shift();
    }
    r.push(nextElem);
  }
  return r;
}

// visualizations.create(
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

visualizations.create(
  "Project Type Distribution",
  "projectTypeDistribution",
  "project",
  function(ctrl){

    var byType = ctrl.eplc().byType;
    var labels = byType.map(function (e){ return e.n; });
    var counts = byType.map(function (e){ return e.c; });

    return {
      data: {
        columns: [
          ["Count per Project Type"].concat(counts)
        ],
        type: "bar"
      },
      axis: {
        x: {
          type: "categorized",
          categories: labels,
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

visualizations.create(
  'Project Count and Amount History',
  'projectCountHistory',
  'project',
  function(ctrl){

    var byMonth = visualizations.padMonths(ctrl.eplc().byMonth);
    var labels = byMonth.map(function (e){ return new Date(e.yearMonth); });
    var countPerMonth = byMonth.map(function (e){ return e.count; });
    var amountPerMonth = byMonth.map(function (e){ return e.amount * 1000; });

    return {
      data: {
        x: "x",
        columns: [
          ["x"].concat(labels),
          ["Count per Month"].concat(countPerMonth),
          ["Amount per Month"].concat(amountPerMonth)
        ],
        axes: {
          "Count per Month": "y",
          "Amount per Month": "y2"
        },
        types: {
          "Count per Month": "bar"
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

visualizations.create(
  'SARO Amount Distribution by Agency',
  'saroAmountAgency',
  'saro',
  function(ctrl){
    var byAgency = ctrl.saros().byAgency.sort(function (a, b){
      if ( a.amount > b.amount )
        return -1;
      if ( a.amount < b.amount )
        return 1;
      return 0;
    })
    var labels = byAgency.map(function (e){ return e.agency; });
    var amountPerAgency = byAgency.map(function (e){ return e.amount; });

    return {
      size: {
        height: 300,
        width: 400
      },
      data: {
        columns: [
          ["Amount per Agency"].concat(amountPerAgency)
        ],
        type: "bar"
      },
      axis: {
        x: {
          type: "categorized",
          categories: labels,
          label: {
            text: "Agency",
            position: "outer-middle"
          }
        },
        y: {
          tick: {
            format: function(t){
              // var format =  d3.format(",")
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

visualizations.create(
  'SARO Count Distribution by Agency',
  'saroCountAgency',
  'saro',
  function(ctrl){
    var byAgency = ctrl.saros().byAgency.sort(function (a, b){
      if ( a.count > b.count )
        return -1;
      if ( a.count < b.count )
        return 1;
      return 0;
    })
    var labels = byAgency.map(function (e){ return e.agency; });
    var countPerAgency = byAgency.map(function (e){ return e.count; });

    return {
      size: {
        height: 300,
        width: 400
      },
      data: {
        columns: [
          ["Count per Agency"].concat(countPerAgency)
        ],
        type: "bar"
      },
      axis: {
        x: {
          type: "categorized",
          categories: labels,
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
        rotated: true
      }
    }
  }
)

visualizations.create(
  'SARO Count and Amount History',
  'saroHistory',
  'saro',
  function(ctrl){

    var byMonth = visualizations.padMonths(ctrl.saros().byMonth)

    var labels = byMonth
      .map(function(s){
        return new Date(s.yearMonth);
      });
    var amountPerMonth = byMonth
      .map(function(g){
        return g.amount;
      });
    var countPerMonth = byMonth
      .map(function(g){
        return g.count;
      });

    // console.log(labels, amountPerMonth);
    return {
      data: {
        x: "x",
        columns: [
          ["x"].concat(labels),
          ["Count per Month"].concat(countPerMonth),
          ["Amount per Month"].concat(amountPerMonth)
        ],
        axes: {
          "Count per Month": "y",
          "Amount per Month": "y2"
        },
        types: {
          "Count per Month": "bar"
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

visualizations.create(
  'Request Count and Amount History',
  'requestHistory',
  'request',
  function(ctrl2){
    var ctrl = ctrl2.requests();
    var labels = _.chain(ctrl.byMonth())
      .pluck('yearMonth')
      .map(function(l){
        return new Date(l);
      })
      .value();
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

visualizations.create(
  'Request Type Distribution',
  'projectTypes',
  'request',
  function(ctrl2){
    var ctrl = ctrl2.requests();
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
      size: {
        height: 400
      },
      data: {
        columns: [
          ["Number of Requests"].concat(counts)
        ],
        type: "bar",
      },
      axis: {
        x: {
          type: "categorized",
          categories: types,
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

visualizations.create(
  'Request History by Disaster Type', 
  'disasterHistory', 
  'request',
  function(ctrl2){
    var ctrl = ctrl2.requests();
    var data = _.chain(ctrl.byDisasterType())
      .groupBy(function(p){
        return p.disasterType;
      })
      .map(function(subData, key){
        return [key].concat(visualizations.padMonths(subData).map(function(d){
          return d.count
        }));
      })
      .value();

    var range = visualizations.padMonths(ctrl.byDisasterType()).map(function(d){
      return new Date(d.yearMonth);
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

visualizations.create(
  'Number of Requests per Unique Named Disaster',
  'topDisasters',
  'request',
  function(ctrl2){
    var ctrl = ctrl2.requests();
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
          categories: cats,
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
        rotated: true,
      },
    }
  }
)

visualizations.create(
  'Request Amounts per Unique Named Disaster',
  'topDisastersAmount',
  'request',
  function(ctrl2){
    var ctrl = ctrl2.requests();
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
          categories: cats,
          label: {
            text: "Disaster",
            position: "outer-middle"
          }
        },
        y: {
          label: {
            text: "Amount in PHP",
            position: "outer-center"
          },
          tick: {
            format: function(t){
              return helper.truncate(t, 2);
            }
          },
        },
        rotated: true
      }
    }
  }
)
