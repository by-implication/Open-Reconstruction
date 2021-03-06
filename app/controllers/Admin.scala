/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

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

  def updateType(kind: String, id: Int) = IsSuperAdmin(){ implicit user => implicit request =>
    typeForm.bindFromRequest.fold(
      Rest.formError(_),
      name => kind match {
        case "disaster" => {
          DisasterType.findById(id).map(
            _.copy(name = name).save().map(t => Rest.success("type" -> t.toJson))
            .getOrElse(Rest.serverError())
          ).getOrElse(Rest.notFound())
        }
        case "project" => {
          ProjectType.findById(id).map(
            _.copy(name = name).save().map(t => Rest.success("type" -> t.toJson))
            .getOrElse(Rest.serverError())
          ).getOrElse(Rest.notFound())
        }
        case _ => Rest.error("no such type")
      }
    )
  }

}
