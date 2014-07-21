package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object Dashboard extends Controller with Secured {

  def PAGE_LIMIT = 20

  def index = Application.index
  def tab(tab: String) = Application.index
  def tabPage(tab: String, page: Int) = Application.index1(page)
  def tabMeta(tab: String, page: Int) = UserAction(){ implicit user => implicit request =>
    tab match {

      case "feed" => {
      	user.copy(lastFeedVisit = Time.now).save()
        val (eventReq, count) = Event.feed(page, PAGE_LIMIT)
      	Rest.success(
      		"lastVisit" -> user.lastFeedVisit,
          "count" -> count,
          "pageLimit" -> PAGE_LIMIT,
      		"events" -> eventReq.map { case (event, req) => {
      			event.listJson() ++ Json.obj(
      				"req" -> Json.obj(
      					"id" -> req.id,
      					"description" -> req.description
    					)
    				)
      		}}
    		)
      }

      case _ => Rest.success("lel" -> "wat")

    }
  }

}
