package controllers

import play.api._
import play.api.mvc._
import recon.models._
import recon.support._

object Viz extends Controller with Secured {

  def index = Application.index
	 
  def indexMeta() = Action {
    Ok(Req.vizData)
  }

  def view(v: String) = Application.index

  def getData(v: String) = Action { implicit request =>
    Visualization.getData(v) match {
      case Some(result) => Rest.success("data" -> result)
      case None => Rest.notFound()
    }
  }

}
