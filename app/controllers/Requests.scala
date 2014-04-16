package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import recon.models._
import recon.support._

object Requests extends Controller with Secured {

  def create() = Action {
    Ok(views.html.index())
  }

  def createForm: Form[Req] = Form(
  	mapping(
      "description" -> nonEmptyText,
      "location" -> nonEmptyText,
      "amount" -> optional(number),
      "photographs" -> text
    )
  	((description, location, amount, photographs) => {
      Req(
        description = description,
        location = location,
        amount = BigDecimal(amount.getOrElse(0))
        // photographs = photographs
      )
    })
  	(_ => None)
	)

  def insert() = UserAction(){ implicit user => implicit request =>
  	if(user.canCreateRequests){
  		createForm.bindFromRequest.fold(
  			Rest.formError(_),
  			_.copy(authorId = user.id).save().map { r =>
  				Rest.success("req" -> r.insertJson)
  			}.getOrElse(Rest.serverError())
			)
  	} else Rest.unauthorized()
  }

}
