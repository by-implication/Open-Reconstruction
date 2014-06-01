welcome.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);

  this.yolandaProposals = m.prop(0);
  this.yolandaSARO  = m.prop(0);
  this.yolandaProjects  = m.prop(0);
  this.boholProposals = m.prop(0);
  this.boholSARO  = m.prop(0);
  this.boholProjects  = m.prop(0);

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


// bohol_amount: 15561332368.8
// bohol_projects: 1626
// bohol_reqs: 54
// yolanda_amount: 38573788128.36
// yolanda_projects: 5236
// yolanda_reqs: 1402


  bi.ajax(routes.controllers.Visualizations.getData("landingPageData")).then(function (kai){
    console.log(kai);
    self.yolandaProposals(kai.data.yolanda_reqs);
    self.yolandaSARO(kai.data.yolanda_amount);
    self.yolandaProjects(kai.data.yolanda_projects);
    self.boholProposals(kai.data.bohol_reqs);
    self.boholSARO(kai.data.bohol_amount);
    self.boholProjects(kai.data.bohol_projects);
  });


}




