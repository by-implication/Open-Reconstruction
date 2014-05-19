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

  lazy val typeForm: Form[String] = Form("name" -> nonEmptyText)

  def insertType(kind: String) = IsSuperAdmin(){ implicit user => implicit request =>
    typeForm.bindFromRequest.fold(
      Rest.formError(_),
      name => kind match {
        case "project" => ProjectType(name = name).create().map { p =>
          Rest.success("projectType" -> p.toJson)
        }.getOrElse(Rest.serverError())
        case "disaster" => DisasterType(name = name).create().map { d =>
          Rest.success("disasterType" -> d.toJson)
        }.getOrElse(Rest.serverError())
        case _ => Rest.error("invalid type")
      }
    )
  }

}
