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

  def insert = Application.index
  def update = Application.index1 _
  def deprecate = Application.index1 _

}
