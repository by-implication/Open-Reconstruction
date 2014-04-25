lguListing.controller = function(){
  
  this.app = new app.controller();
  
  this.regions = m.prop([]);

  m.request({method: "GET", url: ("/agencies/lgus/list"), config: app.xhrConfig}).then(function (r){

    var regions = [];
    r.regions
      .map(function(r){
        return new agency.Region(r);
      })
      .forEach(function (region){
        regions[region.id()] = region;
      });

    var r_lgus = r.lgus.map(function(lgu){
        return new agency.LGU(lgu);
    })

    var lgus = [];
    r_lgus.forEach(function (lgu){
      lgus[lgu.id()] = lgu;
    });

    r_lgus.forEach(function (lgu){
      var parent = lgu.parentLGU() ? lgus[lgu.parentLGU()] : regions[lgu.parentRegion()];
      parent.children( parent.children().concat(lgu) );
    });

    this.regions(regions);

  }.bind(this));

}