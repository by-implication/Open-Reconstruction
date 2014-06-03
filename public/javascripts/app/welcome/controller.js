welcome.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);

  function qtyAmt(){ return {qty: 0, amt: 0} }

  this.vizData = m.prop({
    bohol: {
      proposals: qtyAmt(),
      saro: qtyAmt(),
      projects: qtyAmt(),
      fundedProjects: qtyAmt()
    },
    yolanda: {
      proposals: qtyAmt(),
      saro: qtyAmt(),
      projects: qtyAmt(),
      fundedProjects: qtyAmt()
    }
  });
  
  // graph

  this.saros  = m.prop(0);


  this.percentApproved = function(){
    return self.byLevel()[4].count / self.byLevel()[0].count;
  };

  function nextYearMonth(yearMonth){
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

  function padMonths(a){
    var r = [];
    for(var ym = a[0].yearMonth; a.length; ym = nextYearMonth(ym)){
      var nextElem = {yearMonth: ym, amount: 0, count: 0};
      if(a[0].yearMonth == ym){
        nextElem = a.shift();
      }
      r.push(nextElem);
    }
    return r;
  }

  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);
    self.byLevel(r.byLevel);
    self.byMonth(padMonths(r.byMonth));
    self.byDisasterType(r.byDisasterType);
    // console.log('Disaster Types by Month:');
    // console.log(r.byDisasterType);
  });

  bi.ajax(routes.controllers.Visualizations.getData("landing")).then(function (r){
    self.vizData(r.data);
  });

  this.yolandaSaroVis = _.extend({}, visualizations.library["saroHistory"](self));
  this.yolandaSaroVis.isFullView(true);
  bi.ajax(routes.controllers.Visualizations.getData("DBMBureauG")).then(function(r){
    self.saros(r.data);
  })

  // this is to make sure charts are ok
  // (ideally)  we need a callback when rendering is finished

  window.setTimeout(function(){
    window.onresize();
  },1500);

}
