////////////////////////////////////////////////////
// routes
m.route.mode = "pathname";
m.route(document, window.location.pathname, {
  "/": welcome,
  "/requests": requestListing,
  "/requests/:tab/:page/:projectTypeId/:locFilters": requestListing,
  "/requests/new": requestCreation,
  "/requests/:id": request,
  "/requests/:id/:tab": request,
  "/visualizations/:v": visualization,
  "/dashboard": dashboard,
  "/saro": saro,
  "/welcome": welcome,
  "/users/:id": user,
  "/admin": admin,
  "/admin/lgus": admin,
  "/admin/agencies": admin,
  "/admin/types/project": admin,
  "/admin/types/disaster": admin,
  "/admin/types/new/:kind": admin,
  "/gov-units/new/agency": agencyCreation,
  "/gov-units/new/lgu/:level/:parentId": lguCreation,
  "/gov-units/:id/new-user": userCreation,
  "/gov-units/:id": govUnit,
  "/gov-units/:id/edit": govUnitEdit,
  "/login": login
});
