
////////////////////////////////////////////////////
// routes

m.route(document, window.location.pathname == "/" ? "/requests" : window.location.pathname, {
  "/requests": projectListing,
  "/requests/all": projectListing,
  "/requests/mine": projectListing,
  "/requests/assessor": projectListing,
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
  "/agencies/new": agencyCreation,
  "/lgus/new/:level/:parentId": lguCreation,
  "/agencies/:id/newUser": userCreation,
  "/agencies/:id": agency,
  "/login": login
});

m.route.mode = "pathname";