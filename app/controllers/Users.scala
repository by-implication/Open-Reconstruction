package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import recon.models._
import recon.support._

object Users extends Controller with Secured {

  def login() = Action {
    Ok(views.html.mithril())
  }

  def loginForm: Form[User] = Form(
  	mapping("text" -> text)
  	(text => User(anorm.Id(1)))
  	(_ => None)
	)

  def authenticate = UserAction(){ implicit user => implicit request =>
    if (Secured.attemptLogin(request.remoteAddress)) {
      if(user.isAnonymous){
        loginForm.bindFromRequest.fold(
          Rest.formError(_),
          user => Secured.login(user)(request)
        )
      } else Redirect(routes.Application.index)
    } else Rest.error("too many login attempts")
  }

  def logout() = UserAction(){ implicit user => implicit request =>
    if(!user.isAnonymous){
      Secured.logout()
    } else Redirect(routes.Application.index)
  }

}
