lguListing.controller = function(){
  
  this.app = new app.controller();
  
  this.regions = m.prop([]);

  m.request({method: "GET", url: ("/agencies/lgus/list"), config: app.xhrConfig}).then(function (r){
    
    var provinces = [];
    r.regions.forEach(function (region){
        region.provinces.forEach(function (province){
            provinces[province.id] = province;
        });
    });

    var lgus = [];
    r.lgus.forEach(function (lgu){
        lgus[lgu.id] = lgu;
    });

    r.lgus.forEach(function (lgu){
        var p = lgu.parentId < 0 ? provinces[lgu.parentId] : lgus[lgu.parentId];
        p.children = p.children || [];
        p.children.push(lgu);
    });

    console.log(r.regions);
    this.regions(r.regions);

  }.bind(this));

}