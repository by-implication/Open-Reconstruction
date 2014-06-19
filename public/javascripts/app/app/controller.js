app.controller = function(){
  var self = this;

  $(window).off("scroll"); // todo: refactor

  var anon = {
    isSuperAdmin: false,
    isAdmin: false,
    permissions: [],
    govUnit: {
      acronym: "",
      id: 0,
      name: "",
      role: ""
    }
  };

  this.currentUser = m.prop(anon);

  bi.ajax(routes.controllers.Users.meta()).then(function (r){
    
    this.currentUser(r || anon);

    if(m.route() == routes.controllers.Application.index().url){
      if(m.cookie().logged_in){
        m.route(routes.controllers.Requests.index().url);
      } else {
        m.route(routes.controllers.Application.home().url);
      }
    }

  }.bind(this));

  this.isAuthorized = function(permission){
    return _.contains(this.currentUser().permissions, permission);
  }

  this.isUserAuthorized = function(user, permission){
    return user && _.contains(user.permissions, permission);
  }

  this.isSuperAdmin = function(){
    return this.currentUser().isSuperAdmin;
  }.bind(this);

  this.isDBM = function(){
    return (this.currentUser().govUnit.role == "DBM");
  }.bind(this);

  this.isGovUnitAdmin = function(govUnitId){
    return this.isSuperAdmin() || this.currentUser().isAdmin && this.currentUser().govUnit.id === govUnitId;
  }

  this.getCurrentUserProp = function(prop){
    return this.currentUser() ? this.currentUser()[prop] : null
  }
  
  this.db = {};
  this.db.clear = function(){
    localStorage.clear();
  };

  // this clears timeout of the loading notice (index.scala.html)
  window.clearTimeout(show);
}