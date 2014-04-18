package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import recon.models._
import recon.support._

object Users extends Controller with Secured {

  def login = UserAction(){ implicit user => implicit request =>
    if (Secured.attemptLogin(request.remoteAddress)) {
      if(user.isAnonymous){

        val loginForm: Form[Option[User]] = Form(
          mapping(
            "handle" -> text,
            "password" -> text
          )((h, p) => User.authenticate(h, p))
          (_ => None)
          .verifying("Invalid username/password", _.isDefined)
        )

        loginForm.bindFromRequest.fold(
          Rest.formError(_),
          userOpt => Secured.login(userOpt.get)(request)
        )

      } else Rest.error("already logged in")
    } else Rest.error("too many login attempts")
  }

  def logout() = UserAction(){ implicit user => implicit request =>
    Secured.logout()
  }

  def insert() = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin || user.isAdmin){

      val createForm: Form[User] = Form(
        mapping(
          "handle" -> nonEmptyText,
          "password" -> nonEmptyText,
          "agencyId" -> number.verifying(
            "Can't add users to this agency",
            agencyId => user.isSuperAdmin || agencyId == user.agencyId
          ),
          "isAdmin" -> boolean
        )
        ((handle, password, agencyId, isAdmin) => User(
          handle = handle,
          password = password,
          agencyId = agencyId,
          isAdmin = isAdmin
        ))
        (_ => None)
      )

      createForm.bindFromRequest.fold(
        Rest.formError(_),
        _.create().map(_ => Rest.success())
        .getOrElse(Rest.serverError())
      )

    } else Rest.unauthorized()
  }

}
