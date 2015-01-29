home.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);
  this.requests = m.prop([]);
  this.infoDumpCurrentTab = m.prop("public");

  function qtyAmt(){ return {qty: 0, amt: 0} }

  this.vizData = m.prop({
    bohol: {
      proposals: qtyAmt(),
      saro: qtyAmt(),
      projects: qtyAmt(),
      fundedProjects: qtyAmt(),
      dpwh: qtyAmt()
    },
    yolanda: {
      proposals: qtyAmt(),
      saro: qtyAmt(),
      projects: qtyAmt(),
      fundedProjects: qtyAmt(),
      dpwh: qtyAmt()
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

  bi.ajax(routes.controllers.Viz.getData("landing")).then(function (r){
    self.vizData(r.data);
    self.requests(r.data.requests);
  });

  this.yolandaSaroVis = _.extend({}, viz.library["saroHistory"](self));
  this.yolandaSaroVis.isFullView(true);
  bi.ajax(routes.controllers.Viz.getData("DBMBureauG")).then(function(r){
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


  // draw logo

  this.drawLogo = function() {
    phiDraw(".lines path", "l", 250, 50);
  }

  this.initMap = function(elem, isInit){
    var iconScale = function(count){
      return 36 + Math.sqrt(count / Math.PI);
    }
    var makeDivIcon = function(count, isTerminal){
      return L.divIcon({
        className: "map-data-point " + (isTerminal ? "terminal" : "group"),
        iconSize: [iconScale(count), iconScale(count)],
        html: "<div class='marker'>" + count + "</div>"
      })
    }
    !function tryMap(){
      if($(elem).height()){

        var map = common.leaflet.map(elem);
        map.setZoom(7);
        var markers = new L.MarkerClusterGroup({
          iconCreateFunction: function(cluster){
            var counts = cluster.getAllChildMarkers().reduce(function(acc, head){
              return acc + head.options.data;
            }, 0)
            // console.log(counts);
            
            return makeDivIcon(counts);
          }
        });

        self.requests().forEach(function(r){
          var divIcon = makeDivIcon(r.count, true);
          var c = L.marker([r.lat, r.lng], {fillColor: "red", color: "red", data: r.count, icon: divIcon});
          markers.addLayer(c);
        });

        map.addLayer(markers);

      } else {
        setTimeout(tryMap, 100);
      }
    }()
  }
}
