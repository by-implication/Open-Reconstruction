lguListing.controller = function(){
  this.app = new app.controller();
  
  this.regions = m.prop([]);
  this.lgus = m.prop([]);

  m.request({method: "GET", url: ("/agencies/lgus/list"), config: app.xhrConfig}).then(function (r){
    this.lgus(r.lgus);
    this.regions(r.regions)
  }.bind(this));

}