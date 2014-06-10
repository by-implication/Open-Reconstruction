var callCount = 0;
function tryResize(){
  if(callCount++ == 9){
    window.onresize();
  }
}

visPanel.controller = function(){
  var self = this;
  this.size = m.prop({
    height: 200,
    width: 400
  });
  this.color = m.prop({
    pattern: ['#555', '#ff851b']
  });
  this.grid = m.prop({
    x: {
      show: true
    },
    y: {
      show: true
    }
  });
  this.chartSettings = function(){
    return {
      data: {},
      axis: {}
    }
  }
  this.title = m.prop("Chart Title");
  this.link = m.prop("Chart Link");
  this.type = m.prop("type");
  this.isFullView = m.prop(false);
  this.config = function(elem, isInitialized){
    if(!isInitialized){
      var chartSettings = self.chartSettings();

      if (chartSettings.size){
        self.size(chartSettings.size);
      }

      if (self.isFullView()){
        self.size({
          height: 300,
          width: undefined
        });
        if(!_.isUndefined(chartSettings.axis.x) 
          && !_.isUndefined(chartSettings.axis.x.tick)
          && !_.isUndefined(chartSettings.axis.x.tick.culling)){
          chartSettings.axis.x.tick.culling.max = undefined;
        }
      }
      var chart = c3.generate({
        data: chartSettings.data,
        axis: chartSettings.axis,
        color: self.color(),
        grid: self.grid(),
        size: self.size()
      })
      elem.appendChild(chart.element);
      tryResize();
    }
  }
}