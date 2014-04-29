package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._
import recon.models._
import recon.support._

object Users extends Controller with Secured {

  def loginView = Application.index

  def login = UserAction(){ implicit user => implicit request =>
    if (Secured.attemptLogin(request.remoteAddress)) {

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

    } else Rest.error("too many login attempts")
  }

  def logout() = UserAction(){ implicit user => implicit request =>
    Secured.logout()
  }

  def create = Application.index1 _

  def insert(govUnitId: Int) = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin || (user.isAdmin && user.govUnitId == govUnitId)){

      val createForm: Form[User] = Form(
        mapping(
          "name" -> nonEmptyText,
          "handle" -> nonEmptyText,
          "password" -> nonEmptyText,
          "isAdmin" -> boolean
        )
        ((name, handle, password, isAdmin) => User(
          name = name,
          handle = handle,
          password = password,
          govUnitId = govUnitId,
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

  def view = Application.index1 _

  def viewMeta(id: Int): Action[AnyContent] = GenericAction(){ implicit currentUser => implicit request =>
    User.findById(id) match {
      case Some(user) => Rest.success(
        "user" -> user.infoJson,
        "requests" -> Json.toJson(user.authoredRequests.map(_.indexJson))
      )
      case None => Rest.notFound()
    }
  }

  def info() = UserAction(){ implicit user => implicit request =>
    Ok(user.infoJson)
  }

}
