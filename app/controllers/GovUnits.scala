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
      "regions" -> Json.toJson(Lgu.REGIONS.toSeq.map {
        case (id, name) => Json.obj("id" -> id, "name" -> name)
      }),
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

  def lguCreationMeta(level: Int, parentId: Int) = UserAction(){ implicit user => implicit request =>
    
    val parentName: Option[String] = if(level > 0){
      GovUnit.findById(parentId).map(_.name)
    } else {
      Lgu.REGIONS.get(parentId)
    }

    parentName.map { p =>
      Rest.success("parentName" -> Json.toJson(p))
    }.getOrElse(Rest.notFound())

  }

  def lguInsert(level: Int, parentId: Int) = UserAction(){ implicit user => implicit request =>
    if(level >= 0 && level < 3){
      if(user.isSuperAdmin){
        lguForm.bindFromRequest.fold(
          Rest.formError(_),
          _.create().map { govUnit =>
            
            val lgu = if (level > 0){
              Lgu(govUnit.id, level + 1, parentLguId = Some(parentId))
            } else {
              Lgu(govUnit.id, level + 1, parentRegionId = Some(parentId))
            }

            lgu.create().map { _ =>
              Rest.success()
            }.getOrElse(Rest.serverError())

          }.getOrElse(Rest.serverError())
        )
      } else Rest.unauthorized()
    } else Rest.error("invalid level")
  }

}
