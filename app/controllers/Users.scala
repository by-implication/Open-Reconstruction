package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._
import recon.models._
import recon.support._

object Users extends Controller with Secured {

  def login = Application.index

  def authenticate = UserAction(){ implicit user => implicit request =>
    if (Secured.attemptLogin(request.remoteAddress)) {

      val loginForm: Form[Option[User]] = Form(
        mapping(
          "handle" -> text,
          "password" -> text
        )((h, p) => User.authenticate(h, p))
        (_ => None)
        .verifying("Invalid username/password", _.isDefined)
      )

      loginForm.bindFromRequest.fold(
        Rest.formError(_),
        userOpt => Secured.login(userOpt.get)(request)
      )

    } else Rest.error("too many login attempts")
  }

  def logout() = UserAction(){ implicit user => implicit request =>
    Secured.logout()
  }

  def create = Application.index1 _

  def insert(govUnitId: Int) = UserAction(){ implicit user => implicit request =>
    if(user.isSuperAdmin || (user.isAdmin && user.govUnitId == govUnitId)){

      val createForm: Form[Seq[User]] = Form(
        mapping(
          "users" -> seq(tuple(
            "name" -> nonEmptyText,
            "handle" -> nonEmptyText,
            "password" -> nonEmptyText,
            "isAdmin" -> boolean
          )).verifying("No entries", _.size > 0)
        )
        (users => users.map { u =>
          val (name, handle, password, isAdmin) = u
          User (
            name = name,
            handle = handle,
            password = password,
            govUnitId = govUnitId,
            isAdmin = isAdmin
          )
        })
        (_ => None)
      )
      
      createForm.bindFromRequest.fold(
        Rest.formError(_),
        users => { 
          val (created, failed) = users.map(_.create()).partition(_.isDefined)
          Rest.success(
            "created" -> created.map(u => Json.obj(u.get.insertSeq:_*)),
            "failed" -> failed.size
          )
        }
      )

    } else Rest.unauthorized()
  }

  def update(govUnitId: Int, userId: Int) = UserAction(){ implicit currentUser => implicit request =>
    User.findById(userId) match {
      case Some(user) => if(currentUser.isSuperAdmin || (currentUser.isAdmin && currentUser.govUnitId == govUnitId)){

        val editForm: Form[User] = Form(
          mapping(
            "name" -> nonEmptyText,
            "handle" -> nonEmptyText,
            "isAdmin" -> boolean
          )
          ((name, handle, isAdmin) => {
            user.copy(name = name, handle = handle, isAdmin = isAdmin)
          })
          (_ => None)
        )
        
        editForm.bindFromRequest.fold(
          Rest.formError(_),
          user => {
            user.save() 
            Rest.success()
          } 
        )

      } else Rest.unauthorized()
      case None => Rest.notFound()
    }
  }

  def view = Application.index1 _
  def viewPage(id: Int, page: Int, sort: String, sortDir: String) = Application.index

  def viewMeta(id: Int, page: Int, sort: String, sortDir: String): Action[AnyContent] = GenericAction(){ implicit currentUser => implicit request =>
    User.findById(id) match {
      case Some(user) => {

        val limit = Req.PAGE_LIMIT
        val offset = (page - 1) * limit
        val (requests, requestCount): (Seq[Req], Long) = user.authoredRequests(offset, limit, sort, sortDir)

        Rest.success(
          "user" -> user.infoJson,
          "requests" -> {
            Json.toJson( requests.map(_.indexJson))
          },
          "requestCount" -> requestCount,
          "pageLimit" -> Req.PAGE_LIMIT
        )
      } 
      case None => Rest.notFound()
    }
  }

  def meta() = UserAction(){ implicit user => implicit request =>
    Ok(user.infoJson)
  }

}
