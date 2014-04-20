
////////////////////////////////////////////////////
// routes

m.route(document, window.location.pathname == "/" ? "/projects" : window.location.pathname, {
  "/projects": projectListing,
  "/projects/all": projectListing,
  "/projects/mine": projectListing,
  "/projects/new": projectCreation,
  "/projects/:id": project,
  "/projects/:id/assignments": project,
  "/projects/:id/images": project,
  "/projects/:id/documents": project,
  "/projects/:id/activity": project,
  "/dashboard": dashboard,
  "/users/:id": user,
  "/admin": admin,
  "/agencies/new": agencyCreation,
  "/agencies/:id/newUser": userCreation,
  "/agencies/:id": agency,
  "/login": login
});

m.route.mode = "pathname";