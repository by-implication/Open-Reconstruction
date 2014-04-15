package recon.support

import play.api.data.Form
import play.api.i18n._
import play.api.libs.json.JsValue
import play.api.libs.json.Json._
import play.api.mvc.{RequestHeader, SimpleResult}
import play.api.mvc.Results.{BadRequest, InternalServerError, NotFound, Ok, Unauthorized}

object Rest {

  // def NO_FILE: SimpleResult = error("No file included")
  // def FILE_TOO_BIG: SimpleResult = error("Your file cannot exceed " + ImageHandling.MAXFILESIZE)
  // def INVALID_IMAGE_FORMAT: SimpleResult = error("Image must be either JPG or PNG and must not exceed dimensional limits.")

  def success(other: (String, JsValue)*): SimpleResult = Ok(toJson(Map("success" -> toJson("true")) ++ other))

  def redirect(target: String, other: (String, JsValue)*): SimpleResult = success((Seq("redirect" -> toJson(target)) ++ other):_*)

  def formError(form: Form[_], other: (String, JsValue)*): SimpleResult = {
    val messages = form.errors.map(e => e.key -> toJson(Messages(e.message, e.args))).toMap
    error("form error", (Seq("messages" -> toJson(messages)) ++ other):_*)
  }

  def error(reason: String, other: (String, JsValue)*): SimpleResult = BadRequest(toJson(Map(
    "success" -> toJson("false"),
    "reason" -> toJson(reason)
  ) ++ other))

  def unauthorized(): SimpleResult = Unauthorized(toJson(Map("reason" -> "not authorized")))

  def notFound(): SimpleResult = NotFound(toJson(Map("reason" -> "not found")))

  def serverError(): SimpleResult = InternalServerError(toJson(Map("reason" -> "server error")))

}
