package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.{JsNull, Json}
import play.api.mvc._
import recon.models._
import recon.support._

object Requests extends Controller with Secured {

  def createInfo() = UserAction(){ implicit user => implicit request =>
    Ok(Json.obj(
      "disasterTypes" -> DisasterType.jsonList,
      "projectTypes" -> ProjectType.jsonList,
      "projectScopes" -> ProjectScope.jsonList
    ))
  }

  def viewMeta(id: Int) = UserAction(){ implicit user => implicit request =>
    Req.findById(id).map { req =>
      Rest.success(
        "request" -> req.viewJson,
        "canSignoff" -> Json.toJson(user.canSignoff(req)),
        "author" -> User.findById(req.authorId).map(_.infoJson).getOrElse(JsNull),
        "assessingAgencies" -> Json.toJson(Agency.withPermission(Permission.VALIDATE_REQUESTS).map(_.toJson)),
        "implementingAgencies" -> Json.toJson(Agency.withPermission(Permission.IMPLEMENT_REQUESTS).map(_.toJson)),
        "assessingAgency" -> req.assessingAgencyId.map { aid =>
          Agency.findById(aid).map(_.toJson).getOrElse(JsNull)
        }.getOrElse(JsNull),
        "implementingAgency" -> req.implementingAgencyId.map { aid =>
          Agency.findById(aid).map(_.toJson).getOrElse(JsNull)
        }.getOrElse(JsNull),
        "attachments" -> {
          val (imgs, docs) = req.attachments.partition(_._1.isImage)
          val tf = (Attachment.insertJson _).tupled
          Json.obj(
            "imgs" -> imgs.map(tf),
            "docs" -> docs.map(tf)
          )
        },
        "history" -> Json.toJson(Event.findForRequest(id).map(_.listJson))
      )
    }.getOrElse(Rest.notFound())
    
  }

  def insert() = UserAction(){ implicit user => implicit request =>

    val createForm: Form[Req] = Form(
      mapping(
        "amount" -> optional(number),
        "description" -> nonEmptyText,
        "disasterDate" -> date,
        "disasterName" -> optional(text),
        "disasterType" -> nonEmptyText,
        "location" -> nonEmptyText,
        "projectType" -> nonEmptyText,
        "scopeOfWork" -> nonEmptyText
      )
      ((amount, description, 
        disasterDate, disasterName, disasterType,
        location, projectType, scope) => {
        Req(
          amount = BigDecimal(amount.getOrElse(0)),
          description = description,
          disasterDate = disasterDate,
          disasterName = disasterName,
          disasterType = DisasterType.withName(disasterType),
          projectType = ProjectType.withName(projectType),
          scope = ProjectScope.withName(scope),
          location = location
        )
      })
      (_ => None)
    )

  	if(user.canCreateRequests){
  		createForm.bindFromRequest.fold(
  			Rest.formError(_),
  			_.copy(authorId = user.id).save().map { r =>
  				Rest.success("id" -> r.insertJson)
  			}.getOrElse(Rest.serverError())
			)
  	} else Rest.unauthorized()

  }

  def signoff(id: Int) = UserAction(){ implicit user => implicit request =>
    Req.findById(id).map { r =>

      if(user.canSignoff(r)){
        r.copy(level = r.level + 1).save().map( r =>
          Rest.success()
        ).getOrElse(Rest.serverError())
      } else Rest.unauthorized()

    }.getOrElse(Rest.notFound())
  }

  def index() = UserAction(){ implicit user => implicit request =>
    Ok(Json.obj(
      "list" -> Req.indexList().map(_.indexJson),
      "filters" -> ProjectType.jsonList
    ))
  }

  def comment(id: Int) = UserAction(){ implicit user => implicit request =>
    if(!user.isAnonymous){
      Form("content" -> nonEmptyText).bindFromRequest.fold(
        Rest.formError(_),
        content => Event(kind = "comment", content = Some(content), reqId = id).create().map { c =>
          Rest.success()
        }.getOrElse(Rest.serverError())
      )
    } else Rest.unauthorized()

  }

  def assignAssessingAgency(reqId: Int, agencyId: Int) = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin){
      Req.findById(reqId).map { req =>
        Agency.findById(agencyId).map { agency =>
          if(agency.canAssess()){
            req.copy(assessingAgencyId = Some(agencyId)).save().map(_ => Rest.success())
            .getOrElse(Rest.serverError())
          } else Rest.error("Agency not authorized to assess.")
        }.getOrElse(Rest.notFound())
      }.getOrElse(Rest.notFound())
    } else Rest.unauthorized()
  }

  def assignImplementingAgency(reqId: Int, agencyId: Int) = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin){
      Req.findById(reqId).map { req =>
        Agency.findById(agencyId).map { agency =>
          if(agency.canImplement()){
            req.copy(implementingAgencyId = Some(agencyId)).save().map(_ => Rest.success())
            .getOrElse(Rest.serverError())
          } else Rest.error("Agency not authorized to implement.")
        }.getOrElse(Rest.notFound())
      }.getOrElse(Rest.notFound())
    } else Rest.unauthorized()
  }

}
