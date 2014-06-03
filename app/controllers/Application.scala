package controllers

import play.api._
import play.api.libs.json._
import play.api.mvc._
import play.api.Play.current
import play.api.templates._
import recon.models._
import scala.util.Try

object Application extends Controller with Secured {

  import scala.collection.JavaConverters._
  lazy val prerenderEnabled = current.configuration.getBoolean("prerender.enabled").getOrElse(false)
  lazy val prerenderBotsOnly = current.configuration.getBoolean("prerender.botsOnly").getOrElse(false)
  lazy val bots = current.configuration.getStringList("prerender.bots").map( _.asScala ).getOrElse(Seq())

  private def isBot(userAgent: String) = {
    val u = userAgent.toLowerCase
    bots exists (u contains _)
  }

  def index = UserAction(){ implicit user => implicit request =>

    if(user.isAnon){

      val doNotPrerender = request.headers.get("X-Do-Not-Prerender") match {
        case Some(b) => Try(b.toBoolean).getOrElse(false)
        case None => false
      }

      val isBot = request.headers.get("User-Agent") match {
        case Some(ua) => Application.isBot(ua)
        case None => false
      }

      if(prerenderEnabled){
        if(!doNotPrerender){
          if(!prerenderBotsOnly || isBot){
            play.Logger.info("prerender!")
            val port = Play.configuration.getString("http.port")
            val url = String.format("http://localhost:%s%s", port.getOrElse("9000"), request.uri)
            prerender(url).map { content =>
              Ok(Html(content))
            }.getOrElse(NotFound)
          } else {
            Ok(views.html.index())
          }
        } else {
          Ok(views.html.index())
        }
      } else {
        Ok(views.html.index())
      }

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
    play.Logger.info("Populating database:")
    Req.createSampleRequests
    play.Logger.info("* Requests created")
    Project.createSampleProjects
    play.Logger.info("* Projects created")
    play.Logger.info("* Database population complete!")
    Redirect(routes.Application.index)
  }

  def jsRoutes = Action { implicit request =>
    import routes.javascript._
    Ok(Routes.javascriptRouter("routes")(
      routes.javascript.Application.admin,
      routes.javascript.Application.adminLgus,
      routes.javascript.Application.adminAgencies,
      routes.javascript.Application.dashboard,
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
