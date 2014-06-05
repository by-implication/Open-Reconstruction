dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.requests = m.prop({});
  this.eplc = m.prop({});
  this.saros = m.prop([]);

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);

  this.requests().byDisasterType = m.prop([]);
  this.requests().byProjectType = m.prop([]);
  this.requests().byMonth = m.prop([]);
  this.requests().byLevel = m.prop([]);
  this.requests().byNamedDisaster = m.prop();

  var projectTabs = function(){
    return _.chain(visualizations.library)
      .groupBy(function(v){
        return v(self).type();
      })
      .keys()
      .value();
  }

  this.projectVisTabs = new common.stickyTabs.controller();
  this.projectVisTabs.tabs(_.chain(visualizations.library)
    .groupBy(function(v){
      return v(self).type();
    })
    .keys()
    .map(function(t){
      return {
        label: m.prop(t),
        href: "#" + t + "-visualizations"
      }
    })
    .value()
  );

  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);

    self.requests().byLevel(r.byLevel);
    self.requests().byMonth(visualizations.padMonths(r.byMonth));
    self.requests().byDisasterType(r.byDisasterType);
    self.requests().byProjectType(r.byProjectType);
    self.requests().byNamedDisaster(r.byNamedDisaster);
  });

  bi.ajax(routes.controllers.Visualizations.getData("EPLC")).then(function (r){
    self.eplc(r.data);
  });

  bi.ajax(routes.controllers.Visualizations.getData("DBMBureauG")).then(function(r){
    self.saros(r.data);
  })
  var scrollInit = false;

  this.scrollHandler = function(elem, isInit){
    var boundary = function(elem){
      var posType = $(elem).css("position");
      var offset = 0;
      if (posType === "relative") {
        offset = parseInt($(elem).css("top"));
      }
      return $(elem).position().top - offset;
    }
    var updateTabMenuPos = function(){
      if ($(window).scrollTop() > boundary(elem)) {
        $(".tabs.vertical").css({
          position: "relative",
          top: ($(window).scrollTop()) - boundary(elem)
        })
      } else {
        $(".tabs.vertical").removeAttr("style");
      }
    }
    
    var idPosDict;
    var poss;

    if (isInit) {
      updateTabMenuPos();
      idPosDict = _.chain(self.projectVisTabs.tabs())
        .map(function(t){
          return t.href;
        })
        .map(function(i){
          return [$(i).position().top + $(i).height() - 20, i];
        })
        .object()
        .value();
      poss = _.chain(idPosDict).map(function(v, k){
        return k;
      }).value();

      var windowPos = $(window).scrollTop();
      var closestPos = _.find(poss, function(p){
        return p >= windowPos
      });

      if (self.projectVisTabs.currentSection() != idPosDict[closestPos]) {
        self.projectVisTabs.currentSection(idPosDict[closestPos]);
        m.redraw();
      }
    }
    $(window).on("scroll", function(e){
      if (!scrollInit) {
        m.redraw();
        scrollInit = true;
      } else {
        updateTabMenuPos()
        if (isInit) {
          var windowPos = $(window).scrollTop();
          var closestPos = _.find(poss, function(p){
            return p >= windowPos
          });
          if (self.projectVisTabs.currentSection() != idPosDict[closestPos]) {
            self.projectVisTabs.currentSection(idPosDict[closestPos]);
            m.redraw();
            // console.log(self.projectVisTabs.currentSection());
          }
        };
        // if (isInit) {
        //   var windowPos = $(window).scrollTop();
        //   var closestPos = _.find(poss, function(p){
        //     return p >= windowPos
        //   });
        //   var hash = idPosDict[closestPos];
        //   window.location.hash = hash;
        // };
      }
    })
  }
  
  // this is to make sure charts are ok
  // (ideally) we need a callback when rendering is finished

  window.setTimeout(function(){
    window.onresize();
  },1500);

}
