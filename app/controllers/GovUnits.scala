package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object GovUnits extends Controller with Secured {

  def viewMeta(id: Int): Action[AnyContent] = GenericAction(){ implicit user => implicit request =>
    GovUnit.findById(id) match {
      case Some(govUnit) => Rest.success(
        "agency" -> govUnit.toJson,
        "users" -> Json.toJson(govUnit.users.map(_.infoJson))
      )
      case None => Rest.notFound()
    }
  }

  def allMeta(): Action[AnyContent] = GenericAction(){ implicit user => implicit request =>
    Rest.success("agencies" ->  Json.toJson(GovUnit.listAll.map(_.toJson)))
  }

  lazy val createForm: Form[GovUnit] = Form(
    mapping(
      "name" -> nonEmptyText,
      "acronym" -> optional(text),
      "roleId" -> number
    )
    ((name, acronym, roleId) => GovUnit(name = name, acronym = acronym, roleId = roleId))
    (_ => None)
  )

  def createMeta() = UserAction(){ implicit user => implicit request =>
    Rest.success("roles" ->  Json.toJson(Role.list().map(_.toJson)))
  }

  def insert(): Action[AnyContent] = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin){
      createForm.bindFromRequest.fold(
        Rest.formError(_),
        _.create().map(_ => Rest.success())
        .getOrElse(Rest.serverError())
      )
    } else Rest.unauthorized()
  }

  def lguListing = UserAction(){ implicit user => implicit request =>
    Ok(Json.obj(
      "regions" -> Json.toJson(Lgu.REGIONS.map(_.toJson)),
      "lgus" -> Lgu.jsonList
    ))
  }

  lazy val LGUroleId = {
    Role.findOne("role_name", "LGU").get.id
  }

  lazy val lguForm: Form[GovUnit] = Form(
    mapping(
      "name" -> nonEmptyText,
      "acronym" -> optional(text)
    )
    ((name, acronym) => GovUnit(name = name, acronym = acronym, roleId = LGUroleId))
    (_ => None)
  )

  def lguCreationMeta(parentId: Int) = UserAction(){ implicit user => implicit request =>
    val parentName: Option[String] = Lgu.PROVINCES.get(parentId).map(p => Some(p.name))
      .getOrElse(GovUnit.findById(parentId).map(_.name))

    parentName.map { p =>
      Rest.success("parentName" -> Json.toJson(p))
    }.getOrElse(Rest.notFound())
  }



  def lguInsert(parentId: Int) = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin){
      lguForm.bindFromRequest.fold(
        Rest.formError(_),
        _.create().map { agency =>
          Lgu(agency.id, parentId).create().map { _ =>
            Rest.success()
          }.getOrElse(Rest.serverError())
        }.getOrElse(Rest.serverError())
      )
    } else Rest.unauthorized()
  }

}
