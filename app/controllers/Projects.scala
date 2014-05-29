package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.{JsNull, Json}
import play.api.mvc._
import recon.models._
import recon.support._

object Projects extends Controller with Secured {

  private lazy val projectAmount = bigDecimal(15, 2).verifying("Invalid amount", _ >= 0)

  def insert(id: Int) = UserAction(){ implicit user => implicit request =>
    val result: Option[SimpleResult] = for {
      req <- Req.findById(id)
      implementingAgencyId <- req.implementingAgencyId
    } yield {
      if(implementingAgencyId == user.govUnitId) {
        val createForm: Form[Project] = Form(
          mapping(
            "name" -> nonEmptyText,
            "amount" -> optional(projectAmount)
          )
          ((name, amount) => {
            Project(
              name = name,
              amount = amount.getOrElse(0),
              reqId = id
            )
          })
          (_ => None)
        )
        createForm.bindFromRequest.fold(
          Rest.formError(_),
          _.save().map { project =>
            Rest.success("id" -> project.requestViewJson)
          }.getOrElse(Rest.serverError())
        )
      } else Rest.unauthorized()
    }
    result.getOrElse(Rest.notFound())
  }

}