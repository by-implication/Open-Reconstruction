
////////////////////////////////////////////////////
// routes

m.route(document, window.location.pathname == "/" ? "/projects" : window.location.pathname, {
  "/projects": projectListing,
  "/projects/new": projectCreation,
  "/projects/:id": project,
  "/dashboard": dashboard,
  "/users/:id": user,
  "/admin": admin,
  "/agencies/new": agencyCreation,
  "/agencies/:id": agency,
  "/login": login
});

m.route.mode = "pathname";