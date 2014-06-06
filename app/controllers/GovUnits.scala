package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json._
import play.api.mvc._
import recon.models._
import recon.support._

object GovUnits extends Controller with Secured {

  def createAgency = Application.index
  def view = Application.index1 _
  def edit = Application.index1 _

  def viewMeta(id: Int): Action[AnyContent] = GenericAction(){ implicit user => implicit request =>
    GovUnit.findById(id) match {
      case Some(govUnit) => Rest.success(
        "govUnit" -> govUnit.toJson,
        "users" -> Json.toJson(govUnit.users.map(_.infoJson))
      )
      case None => Rest.notFound()
    }
  }

  def listAgencies(): Action[AnyContent] = GenericAction(){ implicit user => implicit request =>
    Rest.success("agencies" ->  Json.toJson(GovUnit.listAgencies.map(_.toJson)))
  }

  lazy val createAgencyForm: Form[GovUnit] = Form(
    mapping(
      "name" -> nonEmptyText,
      "acronym" -> optional(text),
      "roleId" -> number
    )
    ((name, acronym, roleId) => GovUnit(name = name, acronym = acronym, roleId = roleId))
    (_ => None)
  )

  def createAgencyMeta() = UserAction(){ implicit user => implicit request =>
    Rest.success("roles" -> Role.agencyJsonList)
  }

  def insertAgency(): Action[AnyContent] = IsSuperAdmin(){ implicit user => implicit request =>
    createAgencyForm.bindFromRequest.fold(
      Rest.formError(_),
      _.create().map(_ => Rest.success())
      .getOrElse(Rest.serverError())
    )
  }

  def listLgus = UserAction(){ implicit user => implicit request =>
    Ok(Json.obj(
      "regions" -> Lgu.regionsJson
    ))
  }

  def getChildren(level: Int, id: Int) = UserAction(){ implicit user => implicit request =>
    Ok(Json.toJson(Lgu.getChildren(level, id)))
  }

  lazy val LGUroleId = {
    Role.findOne("role_name", "LGU").get.id
  }

  lazy val createLguForm: Form[GovUnit] = Form(
    mapping(
      "name" -> nonEmptyText,
      "acronym" -> optional(text)
    )
    ((name, acronym) => GovUnit(name = name, acronym = acronym, roleId = LGUroleId))
    (_ => None)
  )

  def createLgu = Application.index2 _

  def createLguMeta(level: Int, parentId: Int) = UserAction(){ implicit user => implicit request =>
    
    val parentName: Option[String] = if(level > 0){
      GovUnit.findById(parentId).map(_.name)
    } else {
      Lgu.REGIONS.get(parentId)
    }

    parentName.map { p =>
      Rest.success("parentName" -> Json.toJson(p))
    }.getOrElse(Rest.notFound())

  }

  def insertLgu(level: Int, parentId: Int) = IsSuperAdmin(){ implicit user => implicit request =>
    if(level >= 0 && level < 3){
      createLguForm.bindFromRequest.fold(
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
    } else Rest.error("invalid level")
  }

  def editMeta(id: Int) = IsSuperAdmin(){ implicit user => implicit request =>
    GovUnit.findById(id).map(g => Ok(Json.obj(
      "govUnit" -> g.toJson,
      "roles" -> Role.agencyJsonList
    )))
    .getOrElse(Rest.notFound())
  }

  def editLguForm(lgu: GovUnit): Form[GovUnit] = Form(
    mapping(
      "name" -> nonEmptyText,
      "acronym" -> optional(text)
    )
    ((name, acronym) => lgu.copy(name = name, acronym = acronym))
    (_ => None)
  )

  def editAgencyForm(agency: GovUnit): Form[GovUnit] = Form(
    mapping(
      "name" -> nonEmptyText,
      "acronym" -> optional(text),
      "roleId" -> number
    )
    ((name, acronym, roleId) => agency.copy(name = name, acronym = acronym, roleId = roleId))
    (_ => None)
  )

  def update(id: Int) = IsSuperAdmin(){ implicit user => implicit request =>
    GovUnit.findById(id).map { g =>
      g.role.name match {
        case "LGU" => editLguForm(g).bindFromRequest.fold(
          Rest.formError(_),
          _.save().map(_ => Rest.success())
          .getOrElse(Rest.serverError())
        )
        case _ => editAgencyForm(g).bindFromRequest.fold(
          Rest.formError(_),
          _.save().map(_ => Rest.success())
          .getOrElse(Rest.serverError())
        )
      }
    }.getOrElse(Rest.notFound())
  }

}
