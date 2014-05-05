
////////////////////////////////////////////////////
// routes

m.route(document, window.location.pathname == "/" ? "/requests" : window.location.pathname, {
  "/requests": projectListing,
  "/requests/all": projectListing,
  "/requests/approval": projectListing,
  "/requests/assessor": projectListing,
  "/requests/implementation": projectListing,
  "/requests/mine": projectListing,
  "/requests/signoff": projectListing,
  "/requests/new": projectCreation,
  "/requests/:id": project,
  "/requests/:id/assignments": project,
  "/requests/:id/images": project,
  "/requests/:id/documents": project,
  "/requests/:id/activity": project,
  "/dashboard": dashboard,
  "/users/:id": user,
  "/admin": admin,
  "/admin/lgus": admin,
  "/admin/agencies": admin,
  "/gov-units/new/agency": agencyCreation,
  "/gov-units/new/lgu/:level/:parentId": lguCreation,
  "/gov-units/:id/newUser": userCreation,
  "/gov-units/:id": govUnit,
  "/login": login
});

m.route.mode = "pathname";