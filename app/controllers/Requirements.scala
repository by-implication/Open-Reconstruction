package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object Requirements extends Controller with Secured {

  def index = Application.index
  def indexMeta = Action {
    Rest.success("reqts" -> Requirement.listAll.map(_.toJson))
  }

  def deprecate(id: Int) = IsSuperAdmin(){ implicit user => implicit request =>
    Requirement.findById(id).map {
      _.copy(isDeprecated = true).save().map { _ =>
        Rest.success()
      }.getOrElse(Rest.serverError())
    }.getOrElse(Rest.error("No such requirement"))
  }

  def upsert = Application.index

}
