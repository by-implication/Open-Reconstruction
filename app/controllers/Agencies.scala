package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object Agencies extends Controller with Secured {

  def viewMeta(id: Int): Action[AnyContent] = GenericAction(){ implicit user => implicit request =>
    Agency.findById(id) match {
      case Some(agency) => Rest.success(
        "agency" -> agency.toJson,
        "users" -> Json.toJson(agency.users.map(_.infoJson))
      )
      case None => Rest.notFound()
    }
  }

  def allMeta(): Action[AnyContent] = GenericAction(){ implicit user => implicit request =>
    Rest.success("agencies" ->  Json.toJson(Agency.list().map(_.toJson)))
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

  def createMeta() = UserAction(){ implicit user => implicit request =>
    Rest.success("roles" ->  Json.toJson(Role.list().map(_.toJson)))
  }

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
