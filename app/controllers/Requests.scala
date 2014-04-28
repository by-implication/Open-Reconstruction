package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.{JsNull, Json}
import play.api.mvc._
import recon.models._
import recon.support._

object Requests extends Controller with Secured {

  private lazy val projectAmount = bigDecimal(15, 2).verifying("Invalid amount", _ >= 0)

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
        "canEdit" -> Json.toJson(user.canEditRequest(req)),
        "isInvolved" -> Json.toJson(user.isInvolvedWith(req)),
        "hasSignedoff" -> Json.toJson(user.hasSignedoff(req)),
        "canSignoff" -> Json.toJson(user.canSignoff(req)),
        "author" -> User.findById(req.authorId).map(_.infoJson).getOrElse(JsNull),
        "assessingAgencies" -> Json.toJson(GovUnit.withPermission(Permission.VALIDATE_REQUESTS).map(_.toJson)),
        "implementingAgencies" -> Json.toJson(GovUnit.withPermission(Permission.IMPLEMENT_REQUESTS).map(_.toJson)),
        "assessingAgency" -> req.assessingAgencyId.map { aid =>
          GovUnit.findById(aid).map(_.toJson).getOrElse(JsNull)
        }.getOrElse(JsNull),
        "implementingAgency" -> req.implementingAgencyId.map { aid =>
          GovUnit.findById(aid).map(_.toJson).getOrElse(JsNull)
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
        "amount" -> optional(projectAmount),
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
          amount = amount.getOrElse(0),
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
  			_.copy(authorId = user.id).save().map { implicit r =>
          Event.newRequest().create().map { _ =>
            Event.disaster().create().map { _ =>
              Checkpoint.push(user).map { _ =>
  				      Rest.success("id" -> r.insertJson)
              }.getOrElse(Rest.serverError())
            }.getOrElse(Rest.serverError())
          }.getOrElse(Rest.serverError())
  			}.getOrElse(Rest.serverError())
			)
  	} else Rest.unauthorized()

  }

  def signoff(id: Int) = UserAction(){ implicit user => implicit request =>
    Req.findById(id).map { r =>

      if(user.canSignoff(r)){

        val signoffForm: Form[Req] = Form(
          mapping("password" -> nonEmptyText.verifying(
            "Incorrect password",
            User.authenticate(user.handle, _).isDefined
          ))
          (_ => r)
          (_ => None)
        )

        signoffForm.bindFromRequest.fold(
          Rest.formError(_),
          r => r.copy(level = r.level + 1).save().map( implicit r =>
            Event.signoff(user.govUnit).create().map { _ =>
              Checkpoint.push(user).map { _ =>
                Rest.success()
              }.getOrElse(Rest.serverError())
            }.getOrElse(Rest.serverError())
          ).getOrElse(Rest.serverError())
        )

      } else Rest.unauthorized()

    }.getOrElse(Rest.notFound())
  }

  def index() = UserAction(){ implicit user => implicit request =>
    val allRequests = Req.indexList()
    Ok(Json.obj(
      "list" -> allRequests.map(_.indexJson),
      "filters" -> ProjectType.jsonList,
      "counts" -> Json.obj(
        "all" -> allRequests.length,
        "signoff" -> allRequests.filter(req => user.canSignoff(req)).length,
        "assessor" -> allRequests.filter(req => (req.level == 0 && !req.assessingAgencyId.isDefined)).length,
        "mine" -> allRequests.filter(req => (User.findById(req.authorId).get.govUnitId == user.govUnitId)).length
      )
    ))
  }

  def comment(id: Int) = UserAction(){ implicit user => implicit request =>
    if(!user.isAnonymous){
      Req.findById(id).map { implicit req =>
        Form("content" -> nonEmptyText).bindFromRequest.fold(
          Rest.formError(_),
          content => Event.comment(content).create().map { _ =>
            Rest.success()
          }.getOrElse(Rest.serverError())
        )
      }.getOrElse(Rest.notFound())
    } else Rest.unauthorized()

  }

  private def assignGovUnit(
      isAuthorized: GovUnit => Boolean,
      assign: (Req, Int) => Req,
      unassign: Req => (Req, GovUnit),
      agencyType: String
    )(reqId: Int, govUnitId: Int) = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin){
      Req.findById(reqId).map { implicit req =>
        govUnitId match {
          case 0 => {
            val (r, govUnit) = unassign(req)
            r.save().map { r =>
              Event.assign(agencyType, false, govUnit).create().map { _ =>
                if(agencyType == "assess") Checkpoint.pop()(r)
                Rest.success()
              }.getOrElse(Rest.serverError())
            }.getOrElse(Rest.serverError())
          }
          case _ => {
            GovUnit.findById(govUnitId).map { govUnit =>
              if(isAuthorized(govUnit)){
                assign(req, govUnitId).save().map { r =>
                  Event.assign(agencyType, true, govUnit).create().map { _ =>
                    if(agencyType == "assess") Checkpoint.push(user)(r)
                    Rest.success()
                  }.getOrElse(Rest.serverError())
                }.getOrElse(Rest.serverError())
              } else Rest.error("GovUnit not authorized to assess.")
            }.getOrElse(Rest.notFound())
          }
        }
      }.getOrElse(Rest.notFound())
    } else Rest.unauthorized()
  }

  def assignAssessingAgency = assignGovUnit(
    GovUnit.canAssess,
    (r, id) => r.copy(assessingAgencyId = Some(id)),
    r => (r.copy(assessingAgencyId = None), GovUnit.findById(r.assessingAgencyId.get).get),
    "assess"
  ) _

  def assignImplementingAgency = assignGovUnit(
    GovUnit.canImplement,
    (r, id) => r.copy(implementingAgencyId = Some(id)),
    r => (r.copy(implementingAgencyId = None), GovUnit.findById(r.implementingAgencyId.get).get),
    "implement"
  ) _

  private def editForm(field: String)(implicit req: Req): Form[Req] = Form(field match {
    case "description" => {
      mapping(
        "input" -> nonEmptyText
      )(v => req.copy(description = v)
      )(_ => None)
    }
    case "amount" => {
      mapping(
        "input" -> projectAmount
      )(v => req.copy(amount = v)
      )(_ => None)
    }
    case "location" => {
      mapping(
        "input" -> nonEmptyText
      )(v => req.copy(location = v)
      )(_ => None)
    }
    case _ => {
      mapping(
        "input" -> text.verifying("Invalid field", _ => false)
      )(v => req
      )(_ => None)
    }
  })

  def editField(id: Int, field: String) = UserAction(){ implicit user => implicit request =>
    if(!user.isAnonymous){
      Req.findById(id).map { implicit req =>
        if(user.canEditRequest(req)){
          editForm(field).bindFromRequest.fold(
            Rest.formError(_),
            _.save().map { implicit req =>
              Event.editField(field).create().map { _ =>
                Rest.success()
              }.getOrElse(Rest.serverError())
            }.getOrElse(Rest.serverError())
          )
        } else Rest.unauthorized()
      }.getOrElse(Rest.notFound())
    } else Rest.unauthorized()
  }

}
