/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

var govUnit = {}

govUnit.Agency = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
  this.slug = m.prop(this.name().replace(/ /g, "-").replace(/\./g, "").toLowerCase());
}

govUnit.LGU = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
  if(!this.children) this.children = m.prop([]) // for barangays
  this.isExpanded = m.prop(false);
}

govUnit.Region = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
  this.level = m.prop(0);
  this.children = m.prop([]);
  this.isExpanded = m.prop(false);
}