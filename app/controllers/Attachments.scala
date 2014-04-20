package controllers

import java.io.File
import play.api._
import play.api.libs.Files.TemporaryFile
import play.api.mvc._
import recon.models._
import recon.support._

object Attachments extends Controller with Secured {

  def add(id: Int) = UserAction(parse.multipartFormData){ implicit user => implicit request =>
    request.body.file("file").map { upload =>
      Req.findById(id) match {
        case Some(req) => {
          if(user.canEditRequest(req)){
            Attachment(filename = upload.filename, uploaderId = user.id).create().map { a =>
              a.file.getParentFile().mkdirs()
              upload.ref.moveTo(a.file, true)
              req.copy(attachmentIds = req.attachmentIds.list :+ a.id.get).save().map(
                _ => Rest.success("attachment" -> Attachment.insertJson(a, user))
              ).getOrElse(Rest.serverError())
            }.getOrElse(Rest.serverError())
          } else Rest.unauthorized()
        }
        case None => Rest.notFound()
      }
    }.getOrElse(Rest.NO_FILE)
  }

  private def get(inline: Boolean)(id: Int) = Action {
    Attachment.findById(id).map { attachment =>
      Ok.sendFile(attachment.file, inline, _ => attachment.filename)
    }.getOrElse(NotFound)
  }

  def preview = get(true) _
  def download = get(false) _

}
