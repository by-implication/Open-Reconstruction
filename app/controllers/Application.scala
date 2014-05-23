package controllers

import play.api._
import play.api.libs.json._
import play.api.mvc._
import play.api.Play.current
import play.api.templates._
import recon.models._
import scala.util.Try

object Application extends Controller {

  def index = Action { implicit request =>

    val prerenderFlagOn = current.configuration.getBoolean("recon.prerender").getOrElse(false)

    val doNotPrerender = request.headers.get("X-Do-Not-Prerender") match {
      case Some(b) => Try(b.toBoolean).getOrElse(false)
      case None => false
    }

    if(prerenderFlagOn && !doNotPrerender){
      val port = Play.configuration.getString("http.port")
      val url = String.format("http://localhost:%s%s", port.getOrElse("9000"), request.uri)
      prerender(url).map { content =>
        Ok(Html(content))
      }.getOrElse(NotFound)
    } else {
      Ok(views.html.index())
    }
    
  }

  def prerender(url: String): Option[String] = {
    import scala.sys.process._
    val result = Seq("phantomjs", "prerender.js", url).!!
    val jsResult = Json.parse(result)
    if ((jsResult \ "status").as[String] == "success"){
      (jsResult \ "content").asOpt[String]
    } else None
  }

  def index1(x: Int) = index
  def index2(x: Int, y: Int) = index

  def dashboard = index
  def admin = index
  def adminLgus = index
  def adminAgencies = index

  def csvParser() = Action { Ok(views.html.csvParser()) }
  def lguParser() = Action { Ok(views.html.lguParser()) }

  def process() = Action {
    Ok(views.html.js.process()).withHeaders("Content-Type" -> "text/javascript")
  }

  def dashboardMeta() = Action {
    Ok(Json.toJson(Req.listAll.map(_.dashboardJson)))
  }

  def jsRoutes = Action { implicit request =>
    import routes.javascript._
    Ok(Routes.javascriptRouter("routes")(
      routes.javascript.Application.admin,
      routes.javascript.Application.adminLgus,
      routes.javascript.Application.adminAgencies,
      routes.javascript.Application.dashboard,
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
      Requests.viewMeta,
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
