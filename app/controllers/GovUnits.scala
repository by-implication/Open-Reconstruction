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
  def viewPage = Application.index2 _
  def edit = Application.index1 _

  def viewMeta(id: Int, p: Int): Action[AnyContent] = GenericAction(){ implicit user => implicit request =>
    GovUnit.findById(id) match {
      case Some(govUnit) => {
        val (reqs, count) = govUnit.requests(p)
        Rest.success(
          "govUnit" -> govUnit.toJson,
          "users" -> govUnit.users.map(_.infoJson),
          "requests" -> reqs.map(_.indexJson),
          "totalReqs" -> count,
          "pageLimit" -> Req.PAGE_LIMIT,
          "lgu" -> Lgu.findById(id).map { lgu =>

            def relativeJson(g: GovUnit) = Json.obj(
              "id" -> g.id,
              "name" -> g.name
            )

            val lat: BigDecimal = lgu.lat.getOrElse(lgu.getMeanLat)
            val lng: BigDecimal = lgu.lng.getOrElse(lgu.getMeanLng)

            Json.obj(
              "level" -> lgu.level,
              "children" -> lgu.children.map { case (govUnit, lgu) => relativeJson(govUnit) },
              "ancestors" -> lgu.ancestors.map(relativeJson),
              "lat" -> lat,
              "lng" -> lng
            )

          }
        )
      }
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

  def getChildren(psgc: String) = UserAction(){ implicit user => implicit request =>

    def toJson(t: (GovUnit, Lgu)) = {
      t match {
        case (govUnit, lgu) => govUnit.toJson ++ Json.obj(
          "level" -> lgu.level,
          "psgc" -> lgu.psgc.toString
        )
      }
    }

    Ok(Json.toJson(Lgu.getChildren(PGLTree.fromString(psgc)).map(toJson)))

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
          
          val psgc = if(level == 0){
            Seq(parentId)
          } else {
            Lgu.findById(parentId).get.psgc.list :+ parentId
          }

          Lgu(govUnit.id, psgc = psgc).create().map { _ =>
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
      
      (g.role.name match {
        case "LGU" => editLguForm(g)
        case _ => editAgencyForm(g)
      }).bindFromRequest.fold(
        Rest.formError(_),
        _.withUpdatedSearchKey().save().map { g =>
          g.lguOpt.map(_.updateDescendantSearchKeys())
          Rest.success()
        }.getOrElse(Rest.serverError())
      )

    }.getOrElse(Rest.notFound())
  }

  def search(s: String) = UserAction(){ implicit user => implicit request =>
    Rest.success(
      "govUnits" -> GovUnit.search(s).map { g =>
        Json.obj(
          "id" -> g.id,
          "text" -> g.searchKey
        )
      }
    )
  }

}
