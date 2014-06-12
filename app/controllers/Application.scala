package controllers

import play.api._
import play.api.libs.json._
import play.api.mvc._
import recon.models._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def index1(x: Int) = index
  def index2(x: Int, y: Int) = index

  def dashboard = index
  def welcome = index
  def saro = index
  def admin = index
  def adminLgus = index
  def adminAgencies = index

  def csvParser() = Action { Ok(views.html.csvParser()) }
  def lguParser() = Action { Ok(views.html.lguParser()) }

  def process() = Action {
    Ok(views.html.js.process()).withHeaders("Content-Type" -> "text/javascript")
  }

  def dashboardMeta() = Action {
    Ok(Req.dashboardData)
  }

  def populate() = Action { implicit request =>
    play.Logger.info("  Processing PSGC migrations")
    play.Logger.info(Req.assignByPsgc)
    play.Logger.info("* PSGC processed")
    Redirect(routes.Application.index)
  }

  def jsRoutes = Action { implicit request =>
    import routes.javascript._
    Ok(Routes.javascriptRouter("routes")(
      routes.javascript.Application.admin,
      routes.javascript.Application.adminLgus,
      routes.javascript.Application.adminAgencies,
      routes.javascript.Application.dashboard,
      routes.javascript.Application.index,
      routes.javascript.Application.saro,
      routes.javascript.Application.welcome,
      routes.javascript.Application.dashboardMeta,
      routes.javascript.Application.process,
      Users.authenticate,
      Users.create,
      Users.login,
      Users.logout,
      Users.meta,
      Users.insert,
      Users.view,
      Users.viewMeta,
      Admin.insertType,
      Admin.updateType,
      Admin.projectTypes,
      Admin.projectTypesMeta,
      Admin.disasterTypes,
      Admin.disasterTypesMeta,
      Attachments.add,
      Attachments.archive,
      Attachments.unarchive,
      Attachments.preview,
      Attachments.download,
      Attachments.thumb,
      Assets.at,
      Projects.insert,
      Requests.assignSaro,
      Requests.comment,
      Requests.create,
      Requests.createMeta,
      Requests.editField,
      Requests.index,
      Requests.indexPage,
      Requests.indexMeta,
      Requests.insert,
      Requests.reject,
      Requests.signoff,
      Requests.view,
      Requests.viewAssignments,
      Requests.viewImages,
      Requests.viewDocuments,
      Requests.viewActivity,
      Requests.viewReferences,
      Requests.viewMeta,
      Visualizations.view,
      Visualizations.getData,
      GovUnits.edit,
      GovUnits.editMeta,
      GovUnits.update,
      GovUnits.getChildren,
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
