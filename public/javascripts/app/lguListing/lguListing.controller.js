lguListing.controller = function(){
  
  this.app = new app.controller();
  
  this.regions = m.prop([]);

  m.request({method: "GET", url: ("/agencies/lgus/list"), config: app.xhrConfig}).then(function (r){

    var regions = [];
    r.regions.forEach(function (region){
      regions[region.id] = region;
    });

    var lgus = [];
    r.lgus.forEach(function (lgu){
      lgus[lgu.id] = lgu;
    });

    r.lgus.forEach(function (lgu){
      var parent = lgu.parentLGU ? lgus[lgu.parentLGU] : regions[lgu.parentRegion];
      parent.children = parent.children || [];
      parent.children.push(lgu);
    });

    this.regions(regions);

  }.bind(this));

}