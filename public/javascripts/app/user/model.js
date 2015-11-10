/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

var user = {
  // model
  LGU: function(name, address){
    this.name = name;
    this.address = address;
    this.slug = name.replace(/ /g, "-").replace(/\./g, "").toLowerCase();
  },
  NGA: function(name, department){
    this.name = name;
    this.department = department;
    this.slug = name.replace(/ /g, "-").replace(/\./g, "").toLowerCase();
  },
  GUEST: function(){
    this.name = "Guest";
    this.department = "";
    this.slug = null;
  }
}