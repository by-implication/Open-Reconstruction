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
  "/requests": requestListing,
  "/requests/:tab/:page/:projectTypeId/:l/:sort/:sortDir/:disaster": requestListing,
  "/requests/new": requestCreation,
  "/requests/:id": request,
  "/requests/:id/:tab": request,
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
  "/gov-units/new/agency": agencyCreation,
  "/gov-units/new/lgu/:level/:parentId": lguCreation,
  "/gov-units/:id/new-user": userCreation,
  "/gov-units/:id": govUnit,
  "/gov-units/:id/:page": govUnit,
  "/gov-units/:id/edit": govUnitEdit,
  "/login": login,
  "/faq": faq
}));
