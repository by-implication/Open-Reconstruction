package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object Admin extends Controller with Secured {

  def projectTypes = Application.index
  def disasterTypes = Application.index

  def projectTypesMeta = Action {
  	Ok(ProjectType.jsonList)
  }

  def disasterTypesMeta = Action {
  	Ok(DisasterType.jsonList)
  }

  def insertType(kind: String) = IsSuperAdmin(){ implicit user => implicit request =>
  	Ok(kind)
  }

}
