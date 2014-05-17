
////////////////////////////////////////////////////
// routes

m.route(document, window.location.pathname == "/" ? "/requests" : window.location.pathname, {
  "/requests": requestListing,
  "/requests/all": requestListing,
  "/requests/approval": requestListing,
  "/requests/assessor": requestListing,
  "/requests/implementation": requestListing,
  "/requests/mine": requestListing,
  "/requests/signoff": requestListing,
  "/requests/new": requestCreation,
  "/requests/:id": request,
  "/requests/:id/assignments": request,
  "/requests/:id/images": request,
  "/requests/:id/documents": request,
  "/requests/:id/activity": request,
  "/dashboard": dashboard,
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

m.route.mode = "pathname";