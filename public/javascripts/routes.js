
////////////////////////////////////////////////////
// routes

m.route(document, window.location.pathname == "/" ? "/projects" : window.location.pathname, {
  "/projects": projectListing,
  "/projects/all": projectListing,
  "/projects/mine": projectListing,
  "/projects/assessor": projectListing,
  "/projects/signoff": projectListing,
  "/projects/new": projectCreation,
  "/projects/:id": project,
  "/projects/:id/assignments": project,
  "/projects/:id/images": project,
  "/projects/:id/documents": project,
  "/projects/:id/activity": project,
  "/dashboard": dashboard,
  "/users/:id": user,
  "/admin": admin,
  "/admin/lgus": lguListing,
  "/agencies/new": agencyCreation,
  "/lgus/new/:level/:parentId": lguCreation,
  "/agencies/:id/newUser": userCreation,
  "/agencies/:id": agency,
  "/login": login
});

m.route.mode = "pathname";