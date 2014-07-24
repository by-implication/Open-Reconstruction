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
            // play.Logger.info("prerender!")
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

  def home = index
  def admin = index
  def adminLgus = index
  def adminAgencies = index
  def faq = index
  def browse = index

  def process() = Action {
    Ok(views.html.js.process()).withHeaders("Content-Type" -> "text/javascript")
  }

  def populate() = Action { implicit request =>
    if(Play.mode == Mode.Dev) {
      play.Logger.info("  Generating Sample Users")
      play.Logger.info(User.generateSamples())
      play.Logger.info("* Sample users generated")
    }

    play.Logger.info("  Generating legacy Users")
    play.Logger.info(User.generateLegacyUsers())
    play.Logger.info("* Legacy users generated")

    Redirect(routes.Application.index)
  }

  def jsRoutes = Action { implicit request =>
    import routes.javascript._
    Ok(Routes.javascriptRouter("routes")(
      routes.javascript.Application.admin,
      routes.javascript.Application.adminLgus,
      routes.javascript.Application.adminAgencies,
      routes.javascript.Application.index,
      routes.javascript.Application.faq,
      routes.javascript.Application.home,
      routes.javascript.Application.process,
      routes.javascript.Application.browse,
      Users.authenticate,
      Users.create,
      Users.login,
      Users.logout,
      Users.meta,
      Users.insert,
      Users.view,
      Users.viewPage,
      Users.viewMeta,
      Admin.insertType,
      Admin.updateType,
      Admin.projectTypes,
      Admin.projectTypesMeta,
      Admin.disasterTypes,
      Admin.disasterTypesMeta,
      Disasters.create,
      Disasters.createMeta,
      Disasters.insert,
      Disasters.edit,
      Disasters.editMeta,
      Disasters.update,
      Disasters.index,
      Disasters.indexMeta,
      Attachments.add,
      Attachments.addToBucket,
      Attachments.archive,
      Attachments.bucketDownload,
      Attachments.bucketPreview,
      Attachments.bucketThumb,
      Attachments.getNewBucketKey,
      Attachments.unarchive,
      Attachments.preview,
      Attachments.download,
      Attachments.thumb,
      Assets.at,
      Projects.index,
      Projects.indexPage,
      Projects.indexMeta,
      Projects.insert,
      Projects.view,
      Projects.viewMeta,
      Requests.comment,
      Requests.create,
      Requests.createMeta,
      Requests.edit,
      Requests.editField,
      Requests.editMeta,
      Requests.index,
      Requests.indexMeta,
      Requests.indexPage,
      Requests.insert,
      Requests.reject,
      Requests.signoff,
      Requests.update,
      Requests.view,
      Requests.viewAssignments,
      Requests.viewImages,
      Requests.viewDocuments,
      Requests.viewActivity,
      Requests.viewReferences,
      Requests.viewMeta,
      Requirements.index,
      Requirements.indexMeta,
      Requirements.upsert,
      Requirements.deprecate,
      Viz.index,
      Viz.indexFilter,
      Viz.indexMeta,
      Viz.view,
      Viz.getData,
      GovUnits.edit,
      GovUnits.editMeta,
      GovUnits.update,
      GovUnits.getChildren,
      GovUnits.listAgencies,
      GovUnits.listLgus,
      GovUnits.view,
      GovUnits.viewMeta,
      GovUnits.viewPage,
      GovUnits.createAgency,
      GovUnits.createAgencyMeta,
      GovUnits.insertAgency,
      GovUnits.createLgu,
      GovUnits.createLguMeta,
      GovUnits.insertLgu,
      GovUnits.search,
      Dashboard.index,
      Dashboard.feed,
      Dashboard.feedMeta,
      Dashboard.feedPage,
      Dashboard.mine,
      Dashboard.mineMeta,
      Dashboard.minePage,
      Dashboard.pending,
      Dashboard.pendingMeta,
      Dashboard.pendingPage
    )).as("text/javascript")
  }

}
