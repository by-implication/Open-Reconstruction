package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def index1(x: Int) = index
  def index2(x: Int, y: Int) = index

  def dashboard = index
  def admin = index
  def adminLgus = index
  def adminAgencies = index

  def csvParser() = Action {
    Ok(views.html.csvParser())
  }

  def jsRoutes = Action { implicit request =>
    import routes.javascript._
    Ok(Routes.javascriptRouter("routes")(
      routes.javascript.Application.admin,
      routes.javascript.Application.adminLgus,
      routes.javascript.Application.adminAgencies,
      routes.javascript.Application.dashboard,
      Users.authenticate,
      Users.create,
      Users.login,
      Users.logout,
      Users.meta,
      Users.insert,
      Users.view,
      Users.viewMeta,
      Attachments.add,
      Attachments.archive,
      Attachments.unarchive,
      Attachments.preview,
      Attachments.download,
      Attachments.thumb,
      Assets.at,
      Requests.assignAssessingAgency,
      Requests.assignImplementingAgency,
      Requests.comment,
      Requests.createMeta,
      Requests.editField,
      Requests.index,
      Requests.indexAll,
      Requests.indexApproval,
      Requests.indexAssessor,
      Requests.indexImplementation,
      Requests.indexMine,
      Requests.indexSignoff,
      Requests.indexMeta,
      Requests.insert,
      Requests.signoff,
      Requests.viewAssignments,
      Requests.viewImages,
      Requests.viewDocuments,
      Requests.viewActivity,
      Requests.viewMeta,
      GovUnits.listAgencies,
      GovUnits.listLgus,
      GovUnits.view,
      GovUnits.viewMeta,
      GovUnits.createAgency,
      GovUnits.createAgencyMeta,
      GovUnits.insertAgency,
      GovUnits.createLgu,
      GovUnits.createLguMeta,
      GovUnits.insertLgu
    )).as("text/javascript")
  }

}
