package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def jsRoutes = Action { implicit request =>
    import routes.javascript._
    Ok(Routes.javascriptRouter("routes")(
      Users.login,
      Users.logout,
      Requests.insert
    )).as("text/javascript")
  }

}
