user.controller = function(){
  var self = this;
  this.id = m.route.param("id");
  this.user = m.prop({});
  this.projectList = m.prop([]);
  this.currentFilter = {projects: function(){return null}};

  database.pull().then(function(data){
    var user = _.find(database.userList(), function(user){
      return user.slug == self.id;
    });
    self.projectList = m.prop(database.projectList().filter(function(project){
      return project.author().name == user.name;
    }));
    self.user(user);
  })
}