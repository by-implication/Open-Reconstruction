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
  });

  bi.ajax(routes.controllers.Visualizations.getData("landing")).then(function (r){
    self.vizData(r.data);
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
}
