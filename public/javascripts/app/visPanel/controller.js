/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

// this is to make sure charts are ok
// (ideally) we need a callback when rendering is finished
visPanel.onresizer = {
  scheduled: false,
  queue: function(){
    if(this.scheduled) return;
    this.scheduled = true;
    setTimeout(function(){
      visPanel.onresizer.scheduled = false;
      window.onresize();
    }, 500);
  }
}

visPanel.controller = function(){
  
  var self = this;
  this.sorts = m.prop([]);
  this.currentSort = m.prop();
  this.size = m.prop({
    height: 200,
    width: null
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
  this.data = m.prop({});
  this.axis = m.prop({});
  this.title = m.prop("Chart Title");
  this.link = m.prop("Chart Link");
  this.tags = m.prop({});
  this.isFullView = m.prop(false);

  this.config = function(elem, isInitialized){
    if(!isInitialized){
      var chartSettings = self.chartSettings();

      if (chartSettings.size){
        self.size(chartSettings.size);
      }

      if (self.isFullView()){
        self.size().width = undefined;
        if (!_.isUndefined(chartSettings.size) && !_.isUndefined(chartSettings.size.height)){
          self.size().height = chartSettings.size.fullViewHeight
        }
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
      visPanel.onresizer.queue();
    }
  }
}