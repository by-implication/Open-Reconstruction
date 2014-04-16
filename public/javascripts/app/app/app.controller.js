app.controller = function(){
  this.currentUser = app.currentUser;
  this.isLoggedIn = function(){
    var currentUserId = localStorage["currentUser"];
    if(currentUserId && this.findUserBySlug(database.userList(), currentUserId)){
      return true;
    } else {
      return false;
    }
  }.bind(this);
  this.login = function(user){
    localStorage["currentUser"] = user.slug
  };
  this.logout = function(){
    // this.currentUser(new user.GUEST());
    localStorage["currentUser"] = null;
  };
  this.getLoggedIn = function(){
    var currentUserId = localStorage["currentUser"];
    return this.findUserBySlug(database.userList(), currentUserId);
  }.bind(this);
  this.findUserBySlug = function(list, slug){
    return _.find(list, function(u){
      return u.slug == slug;
    });
  };
  this.authorizedUsers = function(){
    return database.userList().filter(function(user){
      return user.department === "OCD" || user.department === "DPWH";
    });
  };
  this.initMap = function(elem, isInit, config){
    if(!isInit){
      window.setTimeout(function(){
        var map = L.map(elem, config).setView([11.3333, 123.0167], 5);

        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 19, attribution: osmAttrib});   
        map.addLayer(osm);
      }, 100)
    }
    
  };
  this.db = {};
  this.db.clear = function(){
    localStorage.clear();
  };
}