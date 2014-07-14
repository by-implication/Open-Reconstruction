package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object Feed extends Controller with Secured {

  def index() = Application.index

  def indexMeta() = UserAction(){ implicit user => implicit request =>
  	user.copy(lastFeedVisit = Time.now).save()
  	Rest.success(
  		"lastVisit" -> user.lastFeedVisit,
  		"events" -> Event.feed().map { case (event, req) => {
  			event.listJson() ++ Json.obj(
  				"req" -> Json.obj(
  					"id" -> req.id,
  					"description" -> req.description
					)
				)
  		}}
		)
  }

}
