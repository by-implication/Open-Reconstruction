/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

////////////////////////////////////////////////////
// routes

var GATrackedController = function(controller) {
  return function() {
    ga("send", "pageview", {page: m.route()});
    return controller.apply(this, arguments);
  };
};

function GATrackedRoutes(routes) {
  var map = {};
  for (var key in routes) {
    map[key] = {
      controller: GATrackedController(routes[key].controller),
      view: routes[key].view
    };
  };
  return map;
};

m.route.mode = "pathname";
m.route(document, window.location.pathname, GATrackedRoutes({
  "/": home,
  "/browse/requests": requestListing,
  "/browse/requests/:page/:projectTypeId/:l/:sort/:sortDir/:disaster/:agencyFilterId/:rejectStatus/:requestLevel": requestListing,
  "/dashboard/requests/new": requestCreation,
  "/browse/requests/:id": request,
  "/browse/requests/:id/edit": requestEdit,
  "/browse/requests/:id/:tab": request,
  "/viz/filter/:fgName/:f": vizIndex,
  "/viz/:v": viz,
  "/viz": vizIndex,
  "/home": home,
  "/users/:id": user,
  "/users/:id/:page/:sort/:sortDir": user,
  "/admin": admin,
  "/admin/lgus": admin,
  "/admin/agencies": admin,
  "/admin/disasters": admin,
  "/admin/disasters/new": disasterEditing,
  "/admin/disasters/:id": disasterEditing,
  "/admin/types/project": admin,
  "/admin/types/disaster": admin,
  "/admin/requirements/:t": admin,
  "/gov-units/new/agency": agencyCreation,
  "/gov-units/new/lgu/:level/:parentId": lguCreation,
  "/gov-units/:id": govUnit,
  "/gov-units/:id/edit": govUnitEdit,
  "/gov-units/:id/user/new": userCreation,
  "/gov-units/:id/:t": govUnit,
  "/gov-units/:id/:t/:p": govUnit,
  "/login": login,
  "/faq": faq,
  "/browse/projects": projectIndex,
  "/browse/projects/:p": projectIndex,
  "/browse/project/:id": project,
  "/browse": requestListing,
  "/dashboard": dashboard,
  "/dashboard/:t": dashboard,
  "/dashboard/:t/:p": dashboard,
  "/dashboard/:t/:f/:p": dashboard
}));
