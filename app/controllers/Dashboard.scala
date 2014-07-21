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
  def feed = Application.index
  def feedPage = Application.index1 _
  def feedMeta(page: Int) = UserAction(){ implicit user => implicit request =>
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

  def mine = Application.index
  def minePage = Application.index1 _
  def mineMeta(page: Int) = UserAction(){ implicit user => implicit request =>
    val (reqs, count) = Req.mine(page, PAGE_LIMIT)
    Rest.success(
      "reqs" -> reqs.map(_.indexJson),
      "count" -> count,
      "pageLimit" -> PAGE_LIMIT
    )
  }

  def pending = Application.index
  def pendingPage(filter: String, page:Int) = Application.index
  def pendingMeta(filter: String, page: Int) = UserAction(){ implicit user => implicit request =>
    val (reqs, count) = Req.pending(filter, page, PAGE_LIMIT)
    Rest.success(
      "reqs" -> reqs.map(_.indexJson),
      "count" -> count,
      "pageLimit" -> PAGE_LIMIT
    )
  }

}
