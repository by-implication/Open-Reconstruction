welcome.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);

  // DRY-ify plz

  this.yolandaProposalsAmount = m.prop(0);
  this.yolandaProposalsQuantity = m.prop(0);
  this.yolandaSAROAmount  = m.prop(0);
  this.yolandaSAROQuantity  = m.prop(0);
  this.yolandaProjectsAmount  = m.prop(0);
  this.yolandaProjectsQuantity  = m.prop(0);
  this.boholProposalsAmount = m.prop(0);
  this.boholProposalsQuantity = m.prop(0);
  this.boholSAROAmount  = m.prop(0);
  this.boholSAROQuantity  = m.prop(0);
  this.boholProjectsAmount  = m.prop(0);
  this.boholProjectsQuantity  = m.prop(0);

  // such one-off from kai

  this.yolandaFundedProjectsQuantity = m.prop(0);
  this.yolandaFundedProjectsAmount = m.prop(0);

  this.boholFundedProjectsQuantity = m.prop(0);
  this.boholFundedProjectsAmount = m.prop(0);

  // graph

  this.saros  = m.prop(0);

  // countdowns (or countups)

  this.daysSinceYolanda = m.prop(0);
  this.daysSinceBohol = m.prop(0);


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

  bi.ajax(routes.controllers.Visualizations.getData("landingPageData")).then(function (kai){
    // console.log(kai);
    // wow so WET

    self.yolandaProposalsAmount(kai.data.yolanda_req_amt);
    self.yolandaProposalsQuantity(kai.data.yolanda_req_qty);
    self.yolandaSAROAmount(kai.data.yolanda_saro_amt);
    self.yolandaSAROQuantity(kai.data.yolanda_saro_qty);
    self.yolandaProjectsAmount(kai.data.yolanda_project_amt);
    self.yolandaProjectsQuantity(kai.data.yolanda_project_qty);
    self.boholProposalsAmount(kai.data.bohol_req_amt);
    self.boholProposalsQuantity(kai.data.bohol_req_qty);
    self.boholSAROAmount(kai.data.bohol_saro_amt);
    self.boholSAROQuantity(kai.data.bohol_saro_qty);
    self.boholProjectsAmount(kai.data.bohol_project_amt);
    self.boholProjectsQuantity(kai.data.bohol_project_qty);

    // such one-off from Kai

    self.yolandaFundedProjectsQuantity(kai.data.yolanda_project_funded_qty);
    self.yolandaFundedProjectsAmount(kai.data.yolanda_project_funded_amt);

    self.boholFundedProjectsQuantity(kai.data.bohol_project_funded_qty);
    self.boholFundedProjectsAmount(kai.data.bohol_project_funded_amt);

  });

  this.yolandaSaroVis = _.extend({}, visualizations.library["saroHistory"](self));
  this.yolandaSaroVis.isFullView(true);
  bi.ajax(routes.controllers.Visualizations.getData("DBMBureauG")).then(function(r){
    self.saros(r.data);
  })

  // countdown (countup?) timer

  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  var yolandaDate = new Date(2013,10,3); // this is november
  var boholDate = new Date(2013,9,15); // this is october
  var todayDate = new Date();

  self.daysSinceYolanda = Math.round(Math.abs((todayDate.getTime() - yolandaDate.getTime())/(oneDay)));
  self.daysSinceBohol = Math.round(Math.abs((todayDate.getTime() - boholDate.getTime())/(oneDay)));


  // this is to make sure charts are ok
  // (ideally)  we need a callback when rendering is finished

  window.setTimeout(function(){
    window.onresize();
  },1500);

}
