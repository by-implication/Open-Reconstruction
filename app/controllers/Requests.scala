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
  def edit = Application.index1 _

  def createMeta() = UserAction(){ implicit user => implicit request =>
    Ok(Json.obj(
      "projectTypes" -> ProjectType.jsonList,
      "bucketKey" -> Bucket.getAvailableKey,
      "disasters" -> Disaster.jsonList,
      "requirements" -> Requirement.getFor(user.govUnit.role, true).map(_.toJson)
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
        "author" -> req.author.infoJson,
        "govUnit" -> req.govUnit.toJson,
        "assessingAgencies" -> Json.toJson(GovUnit.withPermission(Permission.VALIDATE_REQUESTS).map(_.toJson)),
        "implementingAgencies" -> Json.toJson(GovUnit.withPermission(Permission.IMPLEMENT_REQUESTS).map(_.toJson)),
        "assessingAgency" -> req.assessingAgencyId.map { aid =>
          GovUnit.findById(aid).map(_.toJson)
        },
        "implementingAgency" -> req.implementingAgencyId.map { aid =>
          GovUnit.findById(aid).map(_.toJson)
        },
        "attachments" -> req.attachments.map((Attachment.insertJson _).tupled),
        "executingAgency" -> req.executingAgencyId.map { aid =>
          GovUnit.findById(aid).map(_.toJson)
        },
        "history" -> Json.toJson(Event.findForRequest(id).map(_.listJson)),
        "projects" -> Json.toJson(req.projects.map(_.requestViewJson)),
        "disasterTypes" -> DisasterType.jsonList,
        "requirements" -> Requirement.getFor(req.govUnit.role).map(_.toJson)
      )
    }.getOrElse(Rest.notFound())
    
  }

  def insert() = UserAction(){ implicit user => implicit request =>

    val createForm: Form[Seq[(Req, String)]] = Form(
      mapping(
        "disasterId" -> number.verifying("No such disaster",
          id => Disaster.findById(id).isDefined
        ),
        "govUnitId" -> number.verifying("No such Government Unit",
          id => GovUnit.findById(id).isDefined
        ),
        "reqs" -> seq(tuple(
          "amount" -> optional(projectAmount),
          "description" -> nonEmptyText,
          "location" -> nonEmptyText,
          "projectTypeId" -> number,
          "bucketKey" -> text
        )).verifying("No entries", _.size > 0)
      )
      ((disasterId, govUnitId, reqs) => {
        reqs.map { r =>
          val (amount, description, location, projectTypeId, bucketKey) = r
          (Req(
            amount = amount.getOrElse(0),
            description = description,
            disasterId = disasterId,
            projectTypeId = projectTypeId,
            location = location,
            govUnitId = govUnitId,
            authorId = user.id
          ), bucketKey)
        }
      })
      (_ => None)
    )

		createForm.bindFromRequest.fold(

			Rest.formError(_),

      rKeys => {

  			val results: Seq[Either[Unit, Req]] = rKeys.map { case (r, bucketKey) => {
          r.save().map { implicit r =>
            Event.newRequest().create().map { _ =>
              Checkpoint.push(user).map { _ =>
                if(Bucket(bucketKey).dumpTo(r)){
  			          Right(r)
                } else {
                  Left()
                }
              }.getOrElse(Left())
            }.getOrElse(Left())
    			}.getOrElse(Left())
        }}

        val pResults = results.partition(_.isRight)

        Rest.success(
          "reqs" -> pResults._1.map(e => Json.obj(e.right.get.insertSeq:_*)),
          "failures" -> pResults._2.size
        )

      }

		)

  }

  def signoff(id: Int) = UserAction(){ implicit user => implicit request =>
    Req.findById(id).map { r =>

      if(user.canSignoff(r)){

        val signoffForm: Form[Req] = if(user.isDBM){
          Form(
            mapping(
              "content" -> nonEmptyText,
              "password" -> nonEmptyText.verifying(
                "Incorrect password",
                User.authenticate(user.handle, _).isDefined
              )
            )
            ((saroNo, _) => r.copy(saroNo = Some(saroNo)))
            (_ => None)
          )
        } else {
          Form(
            mapping("password" -> nonEmptyText.verifying(
              "Incorrect password",
              User.authenticate(user.handle, _).isDefined
            ))
            (_ => r)
            (_ => None)
          )
        }

        signoffForm.bindFromRequest.fold(
          Rest.formError(_),
          r => {
            val newLevel = if (Req.levels(r.level + 1) == "SARO_ASSIGNMENT" && r.executingAgencyId.isDefined) {
              r.level + 2
            } else {
              r.level + 1
            }
            r.copy(level = newLevel).save().map( implicit r =>
              Event.signoff(user.govUnit).create().map { e =>
                Checkpoint.push(user)
                Rest.success("event" -> e.listJson)
              }.getOrElse(Rest.serverError())
            )
          }.getOrElse(Rest.serverError())
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

  def indexPage(tab: String, page: Int, projectTypeId: Int, locFilters: String, sort: String, sortDir: String, disasterId: Int, agencyId: Int) = Application.index

  def indexMeta(tab: String, page: Int, projectTypeId: Int, locFilters: String, sort: String, sortDir: String, disasterId: Int, agencyId: Int) = UserAction(){ implicit user => implicit request =>

    val limit = Req.PAGE_LIMIT
    val offset = (page-1) * limit
    val projectTypeIdOption = if (projectTypeId == 0) None else Some(projectTypeId)

    val psgc = if(locFilters == "-"){
      PGLTree(List.empty[Int])
    } else {
      PGLTree.fromString(locFilters)
    }

    val reqListOption = tab match {
      case "all" | "approval" | "assessor" | "implementation" | "mine" | "signoff" | "executor" => {
        Some(Req.indexList(tab, offset, limit, projectTypeIdOption, psgc, sort, sortDir, disasterId, agencyId))
      }
      case _ => None
    }

    reqListOption.map { reqList =>
      Ok(Json.obj(
        "list" -> reqList.map(_.indexJson),
        "filters" -> ProjectType.jsonList,
        "locFilters" -> Lgu.getLocFilters(psgc),
        "agencies" -> GovUnit.listAgencies.map(_.filterJson),
        "disasters" -> Disaster.jsonList,
        "counts" -> Json.obj(
          "all" -> Req.indexCount("all", projectTypeIdOption, psgc, disasterId, agencyId),
          "approval" -> Req.indexCount("approval", projectTypeIdOption, psgc, disasterId, agencyId),
          "assessor" -> Req.indexCount("assessor", projectTypeIdOption, psgc, disasterId, agencyId),
          "implementation" -> Req.indexCount("implementation", projectTypeIdOption, psgc, disasterId, agencyId),
          "executor" -> Req.indexCount("executor", projectTypeIdOption, psgc, disasterId, agencyId),
          "mine" -> Req.indexCount("mine", projectTypeIdOption, psgc, disasterId, agencyId),
          "signoff" -> Req.indexCount("signoff", projectTypeIdOption, psgc, disasterId, agencyId)
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
          id => (user.isSuperAdmin || user.isDBM) && (id match {
            case 0 => true
            case _ => GovUnit.findById(id).get.canImplement
          })
        )
      )(govUnitId => req.copy(implementingAgencyId = govUnitId match {
          case 0 => None
          case _ => Some(govUnitId)
      }))(_ => None)
    }
    case "executingAgency" => {
      mapping(
        "input" -> number.verifying("Unauthorized",
          id => (Some(user.govUnitId) == req.implementingAgencyId || user.isSuperAdmin || user.isDBM)
        )
      )(govUnitId => req.copy(executingAgencyId = govUnitId match {
          case 0 => None
          case _ => Some(govUnitId)
        }, level = Req.levels(req.level + 1) match {
          case "EXECUTOR_ASSIGNMENT" => req.level + 1
          case _ => req.level
        }
      ))(_ => None)
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
                case "executingAgency" => Event.assign("execute", req.executingAgency)
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

  def editMeta(id: Int) = UserAction(){ implicit user => implicit request =>
    if(user.canCreateLegacy){
      Req.findById(id).map { req =>
        Rest.success(
          "status" -> req.level,
          "date" -> req.date,
          "saroNo" -> req.saroNo
        )
      }.getOrElse(Rest.notFound())
    } else Rest.unauthorized()
  }

  def update(id: Int) = UserAction(){ implicit user => implicit request =>
    if(user.canCreateLegacy){

      def updateForm(id: Int): Form[Option[Req]] = Form(
        mapping(
          "status" -> number,
          "date" -> longNumber,
          "saroNo" -> optional(text)
        )
        ((status, date, saroNo) =>
          Req.findById(id).map(_.copy(
            level = status,
            date = date,
            saroNo = saroNo
          ))
        )(_ => None)
      )

      updateForm(id).bindFromRequest.fold(
        Rest.formError(_),
        _.map {
          _.save().map { implicit req =>
            Event.legacyEdit().create().map { _ =>
              Rest.success()
            }.getOrElse(Rest.serverError())
          }.getOrElse(Rest.serverError())
        }.getOrElse(Rest.notFound())
      )

    } else Rest.unauthorized()
  }

}
