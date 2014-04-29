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
      Attachments.archive,
      Attachments.unarchive,
      Assets.at,
      Requests.insert,
      Requests.editField,
      GovUnits.createMeta,
      GovUnits.allMeta,
      GovUnits.lguListing,
      GovUnits.viewMeta,
      GovUnits.insert
    )).as("text/javascript")
  }

}
