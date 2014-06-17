package recon.support

import play.api.data.Form
import play.api.i18n._
import play.api.libs.json.Json._
import play.api.mvc.{RequestHeader, SimpleResult}
import play.api.mvc.Results.{BadRequest, InternalServerError, NotFound, Ok, Unauthorized}

object Rest {

  def NO_FILE: SimpleResult = error("No file included")
  // def FILE_TOO_BIG: SimpleResult = error("Your file cannot exceed " + ImageHandling.MAXFILESIZE)
  // def INVALID_IMAGE_FORMAT: SimpleResult = error("Image must be either JPG or PNG and must not exceed dimensional limits.")

  def success(other: (String, JsValueWrapper)*): SimpleResult = Ok(obj("success" -> "true") ++ obj(other:_*))

  def redirect(target: String, other: (String, JsValueWrapper)*): SimpleResult = {
    val r: (String, JsValueWrapper) = "redirect" -> target
    success((other :+ r):_*)
  }

  def formError(form: Form[_], other: (String, JsValueWrapper)*): SimpleResult = {
    val m = form.errors.map { e =>
      e.key -> toJson(Messages(e.message, e.args))
    }.toMap
    val r: (String, JsValueWrapper) = "messages" -> m
    error("form error", (other :+ r):_*)
  }

  def error(reason: String, other: (String, JsValueWrapper)*): SimpleResult = BadRequest(obj(
    "success" -> toJson(false),
    "reason" -> toJson(reason)
  ) ++ obj(other:_*))

  def unauthorized(): SimpleResult = Unauthorized(obj("reason" -> "not authorized"))

  def notFound(): SimpleResult = NotFound(obj("reason" -> "not found"))

  def serverError(): SimpleResult = InternalServerError(obj("reason" -> "server error"))

}
