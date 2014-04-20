package controllers

import java.io.File
import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.Files.TemporaryFile
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
    Req.findById(id) match {
      case Some(req) => Rest.success(
        "request" -> req.toJson,
        "author" -> User.findById(req.authorId).map(_.infoJson).getOrElse(JsNull),
        "assessingAgency" -> {req.assessingAgencyId match {
          case Some(id) => Agency.findById(id).map(_.toJson).getOrElse(JsNull)
          case None => JsNull
        }},
        "implementingAgency" -> {req.implementingAgencyId match {
          case Some(id) => Agency.findById(id).map(_.toJson).getOrElse(JsNull)
          case None => JsNull
        }}
      )
      case None => Rest.notFound()
    }
    
  }

  def insert() = UserAction(){ implicit user => implicit request =>

    val createForm: Form[Req] = Form(
      mapping(
        "amount" -> optional(number),
        "attachments" -> seq(number),
        "description" -> nonEmptyText,
        "disasterDate" -> date,
        "disasterName" -> optional(text),
        "disasterType" -> nonEmptyText,
        "location" -> nonEmptyText,
        "projectType" -> nonEmptyText,
        "scopeOfWork" -> nonEmptyText
      )
      ((amount, attachments, description, 
        disasterDate, disasterName, disasterType,
        location, projectType, scope) => {
        Req(
          amount = BigDecimal(amount.getOrElse(0)),
          attachments = attachments,
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
      
      val authorized = r.level match {
        case 0 => r.assessingAgencyId.map(_ == user.agencyId).getOrElse(false)
        case 1 => user.isSuperAdmin
        case 2 => user.role.name == "OP"
        case _ => false
      }

      if(authorized){
        r.copy(level = r.level + 1).save().map( r =>
          Rest.success()
        ).getOrElse(Rest.serverError())
      } else Rest.unauthorized()

    }.getOrElse(Rest.notFound())
  }

  def attach(id: Int) = UserAction(parse.multipartFormData){ implicit user => implicit request =>
    request.body.file("file").map { upload =>
      Req.findById(id) match {
        case Some(req) => {
          if(user.canEditRequest(req)){
            Attachment(filename = upload.filename, uploaderId = user.id).create().map { a =>
              upload.ref.moveTo(new File("attachments" + File.separator + a.dateUploaded), true)
              req.copy(attachments = req.attachments.list :+ a.id.get).save().map(
                _ => Rest.success()
              ).getOrElse(Rest.serverError())
            }.getOrElse(Rest.serverError())
          } else Rest.unauthorized()
        }
        case None => Rest.notFound()
      }
    }.getOrElse(Rest.NO_FILE)
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

  def assignToAgency(reqId: Int, agencyId: Int) = UserAction(){ implicit user => implicit request =>
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

}
