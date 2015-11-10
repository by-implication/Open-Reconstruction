/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

faq.controller = function(ctrl){
  this.app = new app.controller();
  this.faqTabs = new common.stickyTabs.controller();
  this.faqTabs.tabs([
    {label: m.prop("What is Open Reconstruction?"), href: "#what-site"},
    {label: m.prop("What will be tracked?"), href: "#what-track"},
    {label: m.prop("What is the difference between a request and a project?"), href: "#what-request"},
    {label: m.prop("Why is Open Reconstruction currently limited to DPWH projects?"), href: "#why-dpwh"},
    {label: m.prop("How will requests be implemented?"), href: "#how-implement"}
  ]);
}