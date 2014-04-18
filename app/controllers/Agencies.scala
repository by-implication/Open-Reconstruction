package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import recon.models._
import recon.support._

object Agencies extends Controller with Secured {

  def viewMeta(id: Int): Action[AnyContent] = GenericAction(){ implicit user => implicit request =>
    Agency.findById(id) match {
      case Some(agency) => Rest.success("agency" -> agency.toJson)
      case None => Rest.notFound()
    }
  }

  lazy val createForm: Form[Agency] = Form(
    mapping(
      "name" -> nonEmptyText,
      "acronym" -> optional(text),
      "roleId" -> number
    )
    ((name, acronym, roleId) => Agency(name = name, acronym = acronym, roleId = roleId))
    (_ => None)
  )

  def insert(): Action[AnyContent] = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin){
      createForm.bindFromRequest.fold(
        Rest.formError(_),
        _.create().map(_ => Rest.success())
        .getOrElse(Rest.serverError())
      )
    } else Rest.unauthorized()
  }

}
