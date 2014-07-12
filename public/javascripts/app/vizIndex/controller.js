vizIndex.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.requests = m.prop({});
  this.projects = m.prop({});
  this.projectsByAgency
  this.saros = m.prop([]);

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);

  this.requests().byDisasterType = m.prop([]);
  this.requests().byProjectType = m.prop([]);
  this.requests().byMonth = m.prop([]);
  this.requests().byLevel = m.prop([]);
  this.requests().byNamedDisaster = m.prop();

  var projectTabs = function(){
    return _.chain(viz.library)
      .groupBy(function(v){
        return v(self).type();
      })
      .keys()
      .value();
  }

  this.projectVisTabs = new common.stickyTabs.controller();
  this.projectVisTabs.tabs(_.chain(viz.library)
    .groupBy(function(v){
      return v(self).type();
    })
    .keys()
    .map(function(t){
      return {
        label: m.prop(t + " visualizations"),
        href: "#" + t + "-visualizations"
      }
    })
    .value()
  );

  bi.ajax(routes.controllers.Viz.indexMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);

    self.requests().byLevel(r.byLevel);
    self.requests().byMonth(viz.padMonths(r.byMonth));
    self.requests().byDisasterType(r.byDisasterType);
    self.requests().byProjectType(r.byProjectType);
    self.requests().byNamedDisaster(r.byNamedDisaster);
  });

  bi.ajax(routes.controllers.Viz.getData("EPLC")).then(function (r){
    self.projects(r.data);
    self.projects().byAgency = m.prop([{count: 46, amount: 53501000.00, name: "NIA"},
      {count: 15, amount: 846931858.80, name: "DOTC - PPA"},
      {count: 672, amount: 4236815830.03, name: "DA"},
      {count: 7, amount: 432406050.00, name: "DOST"},
      {count: 137, amount: 380105964.72, name: "LWUA"},
      {count: 70, amount: 1845587000.00, name: "DepEd"},
      {count: 179, amount: 3899564838.45, name: "DOTC"},
      {count: 99, amount: 1712302000.00, name: "DSWD"},
      {count: 11, amount: 11518447.00, name: "DILG - BFP"},
      {count: 67, amount: 1279867741.78, name: "DAR"},
      {count: 473, amount: 2945181000.00, name: "DOH"},
      {count: 33, amount: 4837467427.47, name: "DOE"},
      {count: 37, amount: 94619070.00, name: "BFAR"},
      {count: 3058, amount: 8273097698.25, name: "DEPED"},
      {count: 33, amount: 181660000.00, name: "DOT"},
      {count: 51, amount: 8220000.00, name: "DOJ"},
      {count: 695, amount: 9420139929.70, name: "DPWH"},
      {count: 1, amount: 133400000.00, name: "SUC"},
      {count: 31, amount: 32874900.00, name: "DILG - PNP"},
      {count: 1117, amount: 4563601060.94, name: "DILG"},
      {count: 1, amount: 0, name: "Not Specified"},
      {count: 29, amount: 335967358.00, name: "DENR"}
    ]);
  });

  bi.ajax(routes.controllers.Viz.getData("DBMBureauG")).then(function(r){
    self.saros(r.data);
  })

  this.visDict = viz.library;

  this.isotopeConfig = function(elem, isInit){
    var container = $(elem);
    if(!isInit){
      container.isotope({
        itemSelector: ".item",
        masonry: {
          columnWidth: ".item",
          gutter: 20
        }
      })
    }
    setTimeout(function(){
      console.log("trigger!");
      container.isotope('layout');
    }, 100)
  }
}
