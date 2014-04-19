package controllers

import java.io.File
import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.Files.TemporaryFile
import play.api.libs.json.Json
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

  def insert() = UserAction(){ implicit user => implicit request =>

    val createForm: Form[Req] = Form(
      mapping(
        "disaster_type" -> nonEmptyText,
        "disaster_date" -> date,
        "disaster_name" -> optional(text),
        "description" -> nonEmptyText,
        "location" -> nonEmptyText,
        "amount" -> optional(number),
        "photographs" -> text
      )
      ((disasterType, disasterDate, disasterName, description, location, amount, photographs) => {
        Req(
          description = description,
          location = location,
          amount = BigDecimal(amount.getOrElse(0)),
          disasterType = DisasterType.withName(disasterType),
          disasterDate = disasterDate,
          disasterName = disasterName
          // photographs = photographs
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
        case 0 => r.implementingAgencyId.map(_ == user.agencyId).getOrElse(false)
        case 1 => user.isSuperAdmin
        case 2 => user.role.name == "approver"
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

}
