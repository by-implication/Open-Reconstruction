package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.{JsNull, Json}
import play.api.mvc._
import recon.models._
import recon.support._

object Projects extends Controller with Secured {

  def index = Application.index

  def indexPage = Application.index1 _

  def indexMeta(page: Int) = UserAction(){ implicit user => implicit request =>
    val (projects, count) = Project.indexList(page)
    Rest.success(
      "projects" -> projects.map(_.toJson),
      "count" -> count,
      "pageLimit" -> Project.PAGE_LIMIT
    )
  }

  def view = Application.index1 _

  def viewMeta(id: Int) = UserAction(){ implicit user => implicit request =>
    Project.findById(id).map { p =>
      Rest.success("project" -> p.toJson)
    }.getOrElse(Rest.notFound())
  }

  private lazy val projectAmount = bigDecimal(15, 2).verifying("Invalid amount", _ >= 0)

  def insert(id: Int) = UserAction(){ implicit user => implicit request =>
    val result: Option[SimpleResult] = for {
      req <- Req.findById(id)
      implementingAgencyId <- req.implementingAgencyId
    } yield {
      implicit val r: Req = req
      if(implementingAgencyId == user.govUnitId) {
        val createForm: Form[Project] = Form(
          mapping(
            "name" -> nonEmptyText,
            "amount" -> optional(projectAmount),
            "typeId" -> number.verifying("No such project type.",
              ProjectType.findById(_).isDefined
            ),
            "scope" -> nonEmptyText.verifying("No such scope.",
              ProjectScope.contains(_)
            )
          )
          ((name, amount, projectTypeId, scope) => {
            Project(
              name = name,
              amount = amount.getOrElse(0),
              reqId = id,
              projectTypeId = projectTypeId,
              scope = ProjectScope.withName(scope)
            )
          })
          (_ => None)
        )
        createForm.bindFromRequest.fold(
          Rest.formError(_),
          _.save().map { project => 
            Event.addProject(project).create().map {e =>
              Rest.success(
                "event" -> e.listJson(),
                "project" -> project.toJson
              )
            }.getOrElse(Rest.serverError)
          }.getOrElse(Rest.serverError())
        )
      } else Rest.unauthorized()
    }
    result.getOrElse(Rest.notFound())
  }

}
