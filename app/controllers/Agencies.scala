package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object Agencies extends Controller with Secured {

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

  def insert() = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin){
      createForm.bindFromRequest.fold(
        Rest.formError(_),
        _.create().map(_ => Rest.success())
        .getOrElse(Rest.serverError())
      )
    } else Rest.unauthorized()
  }

}
