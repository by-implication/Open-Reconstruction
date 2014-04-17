package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import recon.models._
import recon.support._

object Agencies extends Controller with Secured {

  lazy val createForm: Form[Agency] = Form(
    mapping(
      "name" -> nonEmptyText,
      "roleId" -> number
    )
    ((name, roleId) => Agency(name = name, roleId = roleId))
    (_ => None)
  )

  def insert() = UserAction(){ implicit user => implicit request =>
    if(user.role == "administrator"){
      createForm.bindFromRequest.fold(
        Rest.formError(_),
        _.create().map(_ => Rest.success())
        .getOrElse(Rest.serverError())
      )
    } else Rest.unauthorized()
  }

}
