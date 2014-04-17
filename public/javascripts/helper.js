// ////////////////////////////////////////////////////
// // Helpers

// var genArray = function($from, $to){
//   var list = [];
//   if($from < $to){
//     for(var i = $from; i < $to; i++){
//       list.push(i);
//     }
//   } else {
//     // $from >= $to
//     for (var i = $from; i > $to; i--){
//       list.push(i);
//     }
//   }
//   return list;
// }

// var rand = {
//   int: function(lower, upper){
//     if(typeof(upper) == 'undefined'){
//       // catches for when only one argument is added, meant for upper.
//       upper = lower;
//       lower = 0
//     }
//     return Math.round(Math.random() * (upper - lower)) + lower;
//   },
//   date: function(backThen){
//     if(typeof(backThen) == "undefined"){
//       var backThen = new Date('January 1, 2013');
//     }
//     var now = new Date(Date.now());
//     return new Date(now - Math.round((now - backThen) * Math.random()));
//   },
//   amount: function(){
//     return Math.round(Math.random() * 100) * 100000;
//   },
//   fromArray: function(arr){
//     return _.sample(arr, 1)[0]
//     // var n = Math.random() * (arr.length - 1);
//     // var index = Math.round(n);
//     // return arr[index];
//   }
// }

var helper = {
  truncate: function(input, place){
    var out = "";
    var buffer;
    var suffix = "";

    if(typeof(place) == "undefined"){
      var place = 2;
    }

    var placeCheck = function(val, place){
      if(typeof(place) == "undefined") place = 1;
      if(val / 1000 < 1){
        // this means val cannot be divided by 1000 anymore
        return [val, place];
      } else {
        // val can still be divided by 1000. placeCheck again.
        return placeCheck(val / 1000, place * 1000);
      }
    }

    buffer = placeCheck(input);

    switch(buffer[1]){
      case Math.pow(10, 3):
        suffix = "K";
        break;
      case Math.pow(10, 6):
        suffix = "M";
        break;
      case Math.pow(10, 9):
        suffix = "B";
        break;
      case Math.pow(10, 12):
        suffix = "T";
        break;
      default:
        suffix = "";
        break;
    }

    var roundTo = function(num, place){
      var p = Math.pow(10, place);
      return Math.round(num * p) / p;
    }
    out = roundTo(buffer[0], place) + " " + suffix;
    return out;
  },
  commaize: function(number){
    if(!number){return "";}

    var process = function(acc, arr){
      if (acc.length < 1){
        return arr;
      } else {
        arr.push(acc.substr(-3));
        return process(acc.substr(0, acc.length-3), arr);
      }
    }
    return process(number + "", []).reduceRight(function(acc, head){
      if(acc == ""){
        return head + "";
      } else {
        return acc + "," + head;
      }
    }, "");
  },
  timeago: function (time, local, raw) {
    //time: the time
    //local: compared to what time? default: now
    //raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
    if (!time) return "never";

    if (!local) {
      local = new Date(Date.now());
    }

    // assume that time is of type Date
    time = time.getTime();
    // if (angular.isDate(time)) {
    //   time = time.getTime();
    // } else if (typeof time === "string") {
    //   time = new Date(time).getTime();
    // }

    // assume that local is of type Date
    local = local.getTime();
    // if (angular.isDate(local)) {
    //   local = local.getTime();
    // }else if (typeof local === "string") {
    //   local = new Date(local).getTime();
    // }

    if (typeof time !== 'number' || typeof local !== 'number') {
      return;
    }

    var
      offset = Math.abs((local - time) / 1000),
      span = [],
      MINUTE = 60,
      HOUR = 3600,
      DAY = 86400,
      WEEK = 604800,
      MONTH = 2629744,
      YEAR = 31556926,
      DECADE = 315569260;

    if (offset <= MINUTE)              span = [ '', raw ? 'now' : 'less than a minute' ];
    else if (offset < (MINUTE * 60))   span = [ Math.round(Math.abs(offset / MINUTE)), 'min' ];
    else if (offset < (HOUR * 24))     span = [ Math.round(Math.abs(offset / HOUR)), 'hr' ];
    else if (offset < (DAY * 7))       span = [ Math.round(Math.abs(offset / DAY)), 'day' ];
    else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
    else if (offset < (YEAR * 10))     span = [ Math.round(Math.abs(offset / YEAR)), 'year' ];
    else if (offset < (DECADE * 100))  span = [ Math.round(Math.abs(offset / DECADE)), 'decade' ];
    else                               span = [ '', 'a long time' ];

    span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
    span = span.join(' ');

    if (raw === true) {
      return span;
    }
    return (time <= local) ? span + ' ago' : 'in ' + span;
  },
  monthArray: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
  selfun: function(exp){
    return exp();
  }
}

m.if = function(bool, elem){
  if(bool){
    return elem;
  } else {
    return null;
  }
}

