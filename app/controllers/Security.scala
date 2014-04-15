package controllers

import com.redis.serialization.Parse.Implicits._
import play.api.mvc.BodyParsers._
import play.api.mvc.Results.Redirect
import play.api.mvc.{Action, BodyParser, Controller, Cookie, Request, RequestHeader, Result}
import scala.concurrent.duration._
import recon.models._
import recon.support._

trait Secured {
  self: Controller =>

  import Secured.currentUser

  def ResourceRequest() = UserAction(refreshLogin = false) _

  def UserAction[A](parser: BodyParser[A] = parse.anyContent, refreshLogin: Boolean = true)(f: User => Request[A] => Result): Action[A] = {
    Action(parser) { implicit req =>
      
      val user = currentUser
      
      val result = if(user.isAnonymous || !refreshLogin){
        f(user)(req)
      } else {
        if(LoginExpiry.isExpired(user)){
          Secured.logout()(user, req)
        } else {
          LoginExpiry.refresh(user)
          f(user)(req)
        }
      }

      if(user.isAnonymous && !session.get("session_id").isDefined){
        result.withSession(session + ("session_id" -> user.sessionId.toString))
      } else {
        result
      }

    }
  }

  def GenericAction[A](parser: BodyParser[A] = parse.anyContent)(f: User => Request[A] => Result): Action[A] = {
    Action(parser) { implicit req =>
      val user = currentUser
      f(user)(req)
    }
  }

  def isAjax(implicit request: RequestHeader) = {
    request.headers.get("X-Requested-With").map(_.equals("XMLHttpRequest")).getOrElse(false)
  }
}

object LoginExpiry {

  def PUBLIC = 10.minutes
  def PRIVATE = 7.days

  def set(public: Boolean)(implicit user: User, request: RequestHeader) = {
    _set(Some(public))
  }

  def refresh(user: User)(implicit request: RequestHeader) = {
    _set()(user, request)
  }

  def isExpired(user: User)(implicit request: RequestHeader): Boolean = {
    val key = getSessionKey(user, request)
    Redis.xaction(!_.exists(key))
  }

  private def getSessionKey(user: User, request: RequestHeader): String = {
    val sessionId = request.session.get("session_id").get
    "login-" + user.id + "-" + sessionId
  }

  private def _set(public: Option[Boolean] = None)(implicit user: User, request: RequestHeader) = Redis.xaction { r =>
    val key = getSessionKey(user, request)    
    public.map(p => r.set(key, if(p) "public" else "private"))
    val timeout = if(public.getOrElse(r.get[String](key).get == "public")) PUBLIC else PRIVATE
    r.expire(key, timeout.toSeconds.toInt)
  }

}

object Secured {

  def ATTEMPT_EXPIRY = 10.minutes
  def ATTEMPT_BAN_EXPIRY = 15.minutes
  def MAX_LOGINS = 100

  def attemptLogin(address: String): Boolean = Redis.xaction { r =>
    val key = ("login-attempt-" + address)
    val attempts = r.incr(key).get.toInt
    val allow = attempts < MAX_LOGINS

    val duration = if (allow) ATTEMPT_EXPIRY else ATTEMPT_BAN_EXPIRY

    r.expire(key, duration.toSeconds.toInt)
    allow
  }

  def login(user: User, public: Boolean = false)(implicit request: RequestHeader) = {
    request.session.get("session_id").map(sid => {
      LoginExpiry.set(public)(user, request)
    })
    redirect(request.session + ("user_id" -> user.id.toString))
    .withCookies(Cookie("last_login", user.handle, httpOnly = false))
  }

  def logout()(implicit user: User, request: RequestHeader) = {
    Redis.xaction(_.del("login-" + user.id + "-" + request.session.get("session_id").get))
    Redirect(routes.Application.index).withNewSession
  }

  def currentUser(implicit request: RequestHeader) = {
    request.session.get("user_id").flatMap(id => User.findById(id.toInt))
    .getOrElse(User.Anon)
  }
}
