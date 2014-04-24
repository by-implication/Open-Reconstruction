
////////////////////////////////////////////////////
// routes

m.route(document, window.location.pathname == "/" ? "/projects" : window.location.pathname, {
  "/projects": projectListing,
  "/projects/new": projectCreation,
  "/projects/:id": project,
  "/dashboard": dashboard,
  "/users/:id": user,
  "/admin": admin,
  "/admin/lgus": lguListing,
  "/agencies/new": agencyCreation,
  "/lgus/new/:parentId": lguCreation,
  "/agencies/:id/newUser": userCreation,
  "/agencies/:id": agency,
  "/login": login
});

m.route.mode = "pathname";