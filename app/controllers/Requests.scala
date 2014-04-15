package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import recon.models._
import recon.support._

object Requests extends Controller with Secured {

  def create() = Action {
    Ok(views.html.mithril())
  }

  def createForm: Form[Req] = Form(
    // description, location. Optionally, amount, photographs
  	mapping("text" -> text)
  	(text => Req(anorm.Id(1)))
  	(_ => None)
	)

  def insert() = UserAction(){ implicit user => implicit request =>
  	if(user.canCreateRequests){
  		createForm.bindFromRequest.fold(
  			Rest.formError(_),
  			_.save().map { r =>
  				Rest.success("req" -> r.insertJson)
  			}.getOrElse(Rest.serverError())
			)
  	} else Rest.unauthorized()
  }

}
