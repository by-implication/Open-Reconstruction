
////////////////////////////////////////////////////
// routes

m.route(document, "/projects", {
  "/projects": projectListing,
  "/projects/new": projectCreation,
  "/projects/:id": project,
  "/dashboard": dashboard,
  "/user/:id": user
});