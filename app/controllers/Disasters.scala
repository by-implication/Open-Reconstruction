package controllers

import anorm._
import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object Disasters extends Controller with Secured {

  def index = Application.index
  def create = Application.index
  def edit = Application.index1 _

  def form(id: Option[Int] = None): Form[Disaster] = Form(
    mapping(
      "name" -> optional(text),
      "typeId" -> number,
      "date" -> longNumber
    )((name, typeId, date) => Disaster(id, typeId, date, name)
    )(_ => None)
  )

  def createMeta = IsSuperAdmin(){ implicit user => implicit request =>
  	Rest.success("disasterTypes" -> DisasterType.jsonList)
  }

  def editMeta(id: Int) = IsSuperAdmin(){ implicit user => implicit request =>
		Rest.success(
			"disasterTypes" -> DisasterType.jsonList,
			"disaster" -> Disaster.findById(id).map(_.toJson)
		)
  }

  def insert = IsSuperAdmin(){ implicit user => implicit request =>
    form().bindFromRequest.fold(
      Rest.formError(_),
      _.save().map(_ => Rest.success()).getOrElse(Rest.serverError())
    )
  }

  def update(id: Int) = IsSuperAdmin(){ implicit user => implicit request =>
    form(Some(id)).bindFromRequest.fold(
      Rest.formError(_),
      _.save().map(_ => Rest.success()).getOrElse(Rest.serverError())
    )
  }
  
  def indexMeta = Action {
    Rest.success(
      "disasterTypes" -> DisasterType.jsonList,
      "disasters" -> Disaster.jsonList
    )
  }

}
