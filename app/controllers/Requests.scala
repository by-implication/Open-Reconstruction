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

  def create() = Application.index
  def viewAssignments = Application.index1 _
  def viewImages = Application.index1 _
  def viewDocuments = Application.index1 _
  def viewActivity = Application.index1 _
  def viewReferences = Application.index1 _

  def createMeta() = UserAction(){ implicit user => implicit request =>
    Ok(Json.obj(
      "disasterTypes" -> DisasterType.jsonList,
      "projectTypes" -> ProjectType.jsonList,
      "projectScopes" -> ProjectScope.jsonList
    ))
  }

  def view = Application.index1 _

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
        "history" -> Json.toJson(Event.findForRequest(id).map(_.listJson)),
        "disasterTypes" -> DisasterType.jsonList
      )
    }.getOrElse(Rest.notFound())
    
  }

  def insert() = UserAction(){ implicit user => implicit request =>

    val createForm: Form[Req] = Form(
      mapping(
        "amount" -> optional(projectAmount),
        "description" -> nonEmptyText,
        "disasterDate" -> longNumber,
        "disasterName" -> optional(text),
        "disasterTypeId" -> number,
        "location" -> nonEmptyText,
        "projectTypeId" -> number,
        "scopeOfWork" -> nonEmptyText
      )
      ((amount, description, 
        disasterDate, disasterName, disasterTypeId,
        location, projectTypeId, scope) => {
        Req(
          amount = amount.getOrElse(0),
          description = description,
          disasterDate = new java.sql.Timestamp(disasterDate),
          disasterName = disasterName,
          disasterTypeId = disasterTypeId,
          projectTypeId = projectTypeId,
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
            Event.signoff(user.govUnit).create().map { e =>
              Checkpoint.push(user)
              Rest.success("event" -> e.listJson)
            }.getOrElse(Rest.serverError())
          ).getOrElse(Rest.serverError())
        )

      } else Rest.unauthorized()

    }.getOrElse(Rest.notFound())
  }

  def reject(id: Int) = UserAction(){ implicit user => implicit request =>
    Req.findById(id).map { r =>

      if(user.canReject(r)){

        val rejectForm: Form[(Req, String)] = Form(
          mapping(
            "password" -> nonEmptyText.verifying(
              "Incorrect password",
              User.authenticate(user.handle, _).isDefined
            ),
            "content" -> nonEmptyText
          )
          ((password, content) => (r, content))
          (_ => None)
        )

        rejectForm.bindFromRequest.fold(
          Rest.formError(_),
          { case (r, content) => r.copy(isRejected = true).save().map( implicit r =>
            Event.comment(content).create().map { _ =>
              Event.reject(user.govUnit).create().map { e =>
                Checkpoint.push(user)
                Rest.success("event" -> e.listJson)
              }.getOrElse(Rest.serverError())
            }.getOrElse(Rest.serverError())
          ).getOrElse(Rest.serverError())}
        )

      } else Rest.unauthorized()

    }.getOrElse(Rest.notFound()) 
  }

  def index = Application.index

  def indexPage(tab: String, page: Int, projectTypeId: Int) = Application.index

  def indexMeta(tab: String, page: Int, projectTypeId: Int) = UserAction(){ implicit user => implicit request =>

    val limit = 20
    val offset = page * limit
    val projectTypeIdOption = if (projectTypeId == 0) None else Some(projectTypeId)

    val reqListOption = tab match {
      case "all" | "approval" | "assessor" | "implementation" | "mine" | "signoff" => {
        Some(Req.indexList(tab, offset, limit, projectTypeIdOption))
      }
      case _ => None
    }

    reqListOption.map { reqList =>
      Ok(Json.obj(
        "list" -> reqList.map(_.indexJson),
        "filters" -> ProjectType.jsonList,
        "counts" -> Json.obj(
          "all" -> Req.indexCount("all", projectTypeIdOption),
          "approval" -> Req.indexCount("approval", projectTypeIdOption),
          "assessor" -> Req.indexCount("assessor", projectTypeIdOption),
          "implementation" -> Req.indexCount("implementation", projectTypeIdOption),
          "mine" -> Req.indexCount("mine", projectTypeIdOption),
          "signoff" -> Req.indexCount("signoff", projectTypeIdOption)
        )
      ))
    }.getOrElse(Rest.error("invalid tab"))

  }

  def comment(id: Int) = UserAction(){ implicit user => implicit request =>
    if(!user.isAnon){
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

  private def editForm(field: String)(implicit req: Req, user: User): Form[Req] = Form(field match {
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
    case "disaster" => {
      mapping(
        "input" -> tuple(
          "name" -> optional(text),
          "typeId" -> number,
          "date" -> longNumber
        )
      )({ case (name, typeId, date) => req.copy(
        disasterName = name,
        disasterTypeId = typeId,
        disasterDate = new java.sql.Timestamp(date)
      )})(_ => None)
    }
    case "assessingAgency" => {
      mapping(
        "input" -> (number.verifying("Unauthorized",
          id => user.isSuperAdmin && (id match {
            case 0 => true
            case _ => GovUnit.findById(id).get.canAssess
          })
        ))
      )(req.assignAssessor(_)
      )(_ => None)
    }
    case "implementingAgency" => {
      mapping(
        "input" -> number.verifying("Unauthorized",
          id => user.isSuperAdmin && (id match {
            case 0 => true
            case _ => GovUnit.findById(id).get.canImplement
          })
        )
      )(govUnitId => req.copy(implementingAgencyId = govUnitId match {
          case 0 => None
          case _ => Some(govUnitId)
      }))(_ => None)
    }
    case _ => {
      mapping(
        "input" -> text.verifying("Invalid field", _ => false)
      )(v => req
      )(_ => None)
    }
  })

  def editField(id: Int, field: String) = UserAction(){ implicit user => implicit request =>
    if(!user.isAnon){
      Req.findById(id).map { implicit req =>
        if(user.canEditRequest(req)){
          editForm(field).bindFromRequest.fold(
            Rest.formError(_),
            _.save().map { implicit req =>
              (field match {
                case "assessingAgency" => Event.assign("assess", req.assessingAgency)
                case "implementingAgency" => Event.assign("implement", req.implementingAgency)
                case _ => Event.editField(field)
              }).create().map { e =>
                Rest.success("event" -> e.listJson)
              }.getOrElse(Rest.serverError())
            }.getOrElse(Rest.serverError())
          )
        } else Rest.unauthorized()
      }.getOrElse(Rest.notFound())
    } else Rest.unauthorized()
  }

}
