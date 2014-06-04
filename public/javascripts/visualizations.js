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
  for(var ym = a[0].yearMonth; a.length; ym = visualizations.nextYearMonth(ym)){
    var nextElem = {yearMonth: ym, amount: 0, count: 0};
    if(a[0].yearMonth == ym){
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
//     var one_day=1000*60*60*24;
//     var proto = _.chain(ctrl.projects())
//       .map(function(p){
//         return p.activities.map(function(a){
//           return {
//             name: a.name,
//             dur: (a.end_date - a.start_date)/one_day
//           };
//         });
//       })
//       .flatten()
//       .groupBy("name")
//       .map(function(arr, k){
//         return {
//           name: k,
//           ave_dur: arr.reduce(function(acc, head){
//             return acc + head.dur;
//           }, 0) / arr.length
//         }
//       })
//       .value()
//     var durTimes = _.pluck(proto, "ave_dur");
//     var labels = _.pluck(proto, "name");

//     return {
//       data: {
//         columns: [
//           ["Average Residence Time per Project Activity"].concat(durTimes)
//         ],
//         type: "bar"
//       },
//       axis: {
//         x: {
//           // label: {
//           //   text: "Project Activities",
//           //   position: "outer-middle"
//           // },
//           type: "categorized",
//           categories: labels,
//           // tick: {
//           //   rotate: 90
//           // },
//         },
//         y: {
//           // label: {
//           //   text: "Days",
//           //   position: "outer-center"
//           // },
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
    var projectsByType = _.chain(ctrl.projects())
      .filter(function(p){
        return p["project_type"];
      })
      .groupBy(function(p){
        return p["project_type"];
      })
      .map(function(p, key){
        var obj = {};
        obj.type = key;
        obj.count = p.length;
        return obj;
      })
      .sortBy(function(p){
        return p.count * -1;
      })
      .value()
    var labels = projectsByType.map(function(p){
      return p.type;
    });
    var counts = projectsByType.map(function(p){
      return p.count;
    })
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

    var projectsByMonth = visualizations.padMonths(
      _.chain(ctrl.projects())
        .filter(function(p){
          return p["contract_start_date"];
        })
        .map(function(p){
          var proj = p;
          var date = new Date(p["contract_start_date"]);
          var month = date.getMonth() + 1;
          var paddedMonth = ("0" + month).slice (-2); 
          proj.yearMonth = date.getFullYear() + "-" + paddedMonth;
          return proj;
        })
        .groupBy(function(p){
          return p.yearMonth
        })
        .map(function(p, k){
          return {
            yearMonth: k,
            count: p.length,
            amount: p.reduce(function(acc, head){
              return acc + head.project_abc;
            }, 0)
          }
        })
        .value()
    );
    var labels = projectsByMonth
      .map(function(l){
        return new Date(l.yearMonth);
      });
    var countPerMonth = projectsByMonth
      .map(function(g){
        return g.count;
      });
    var amountPerMonth = projectsByMonth
      .map(function(g){
        return g.amount * 1000;
      });

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
    var sarosByAgency = _.chain(ctrl.saros())
      .filter(function(s){
        return s["agency"];
      })
      .groupBy(function(s){
        return s["agency"];
      })
      .map(function(val, key){
        return {
          agency: key,
          amount: val.reduce(function(acc, head){
            return acc + head.amount;
          }, 0)
        };
      })
      .sortBy(function(a){return a.amount * -1})
      .value();
    var labels = _.pluck(sarosByAgency, "agency");
    var amountPerAgency = _.pluck(sarosByAgency, "amount");

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
    var sarosByAgency = _.chain(ctrl.saros())
      .filter(function(s){
        return s["agency"];
      })
      .groupBy(function(s){
        return s["agency"];
      })
      .map(function(val, key){
        return {
          agency: key,
          count: val.length
        };
      })
      .sortBy(function(a){return a.count * -1})
      .value();
    var labels = _.pluck(sarosByAgency, "agency");
    var countPerAgency = _.pluck(sarosByAgency, "count");

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
            text: "Number of SARO assigned",
            position: "outer-middle"
          }
        },
        y: {
          label: {
            text: "Agency",
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
    var sarosByMonth = visualizations.padMonths(_.chain(ctrl.saros())
      .filter(function(s){
        return s["saro_date"];
      })
      .map(function(s){
        var saro = {};
        var date = new Date(s["saro_date"]);
        var month = date.getMonth() + 1;
        var paddedMonth = ("0" + month).slice (-2); 
        saro.yearMonth = date.getFullYear() + "-" + paddedMonth;
        saro.amount = s.amount;
        return saro;
      })
      .groupBy(function(s){
        return s.yearMonth
      })
      .map(function(s, k){
        return {
          yearMonth: k,
          count: s.length,
          amount: s.reduce(function(acc, head){
            return acc + head.amount;
          }, 0)
        }
      })
      .value()
    );
    var labels = sarosByMonth
      .map(function(s){
        return new Date(s.yearMonth);
      });
    var amountPerMonth = sarosByMonth
      .map(function(g){
        return g.amount;
      });
    var countPerMonth = sarosByMonth
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
        return p.disasterTypeId;
      })
      .map(function(subData, key){
        // console.log(visualizations.padMonths(subData));
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
