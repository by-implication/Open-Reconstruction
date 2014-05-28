visPanel.controller = function(){
  var self = this;
  this.size = m.prop({
    height: 240,
    width: 320
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
  this.config = function(elem){
    var chartSettings = self.chartSettings();
    var chart = c3.generate({
      data: chartSettings.data,
      axis: chartSettings.axis,
      color: self.color(),
      grid: self.grid(),
      size: self.size()
    })
    elem.appendChild(chart.element);
  }
}