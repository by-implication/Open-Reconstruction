welcome.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);

  this.yolandaProposal.amount = m.prop(0);
  this.yolandaProposal.quantity = m.prop(0);
  this.yolandaSARO.amount  = m.prop(0);
  this.yolandaSARO.quantity  = m.prop(0);
  this.yolandaProject.amount  = m.prop(0);
  this.yolandaProject.quantity  = m.prop(0);
  this.boholProposals.amount = m.prop(0);
  this.boholProposals.quantity = m.prop(0);
  this.boholSARO.amount  = m.prop(0);
  this.boholSARO.quantity  = m.prop(0);
  this.boholProjects.amount  = m.prop(0);
  this.boholProjects.quantity  = m.prop(0);

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
    self.yolandaProposal.amount(kai.data.yolanda_reqs);
    self.yolandaProposal.quantity(kai.data.yolanda_reqs);
    self.yolandaSARO.amount(kai.data.yolanda_amount);
    self.yolandaSARO.quantity(kai.data.yolanda_amount);
    self.yolandaProject.amount(kai.data.yolanda_projects);
    self.yolandaProject.quantity(kai.data.yolanda_projects);
    self.boholProposals.amount(kai.data.bohol_reqs);
    self.boholProposals.quantity(kai.data.bohol_reqs);
    self.boholSARO.amount(kai.data.bohol_amount);
    self.boholSARO.quantity(kai.data.bohol_amount);
    self.boholProjects.amount(kai.data.bohol_projects);
    self.boholProjects.quantity(kai.data.bohol_projects);
  });

}
