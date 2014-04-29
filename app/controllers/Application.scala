package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def index1(x: Int) = index
  def index2(x: Int, y: Int) = index

  def csvParser() = Action {
    Ok(views.html.csvParser())
  }

  def jsRoutes = Action { implicit request =>
    import routes.javascript._
    Ok(Routes.javascriptRouter("routes")(
      Users.login,
      Users.logout,
      Users.info,
      Users.insert,
      Users.viewMeta,
      Attachments.archive,
      Attachments.unarchive,
      Assets.at,
      Requests.assignAssessingAgency,
      Requests.assignImplementingAgency,
      Requests.comment,
      Requests.createInfo,
      Requests.editField,
      Requests.index,
      Requests.indexMeta,
      Requests.insert,
      Requests.signoff,
      Requests.viewMeta,
      GovUnits.createMeta,
      GovUnits.allMeta,
      GovUnits.lguListing,
      GovUnits.viewMeta,
      GovUnits.insert,
      GovUnits.lguCreationMeta,
      GovUnits.lguInsert
    )).as("text/javascript")
  }

}
