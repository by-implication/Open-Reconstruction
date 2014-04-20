package controllers

import java.io.File
import play.api._
import play.api.libs.Files.TemporaryFile
import play.api.mvc._
import recon.models._
import recon.support._

object Attachments extends Controller with Secured {

  def add(id: Int, typ: String) = UserAction(parse.multipartFormData){ implicit user => implicit request =>
    request.body.file("file").map { upload =>
      Req.findById(id) match {
        case Some(req) => {
          if(user.canEditRequest(req)){
            Attachment(filename = upload.filename, uploaderId = user.id, isImage = typ == "img")
                .create().map { a =>
              a.file.getParentFile().mkdirs()
              upload.ref.moveTo(a.file, true)
              if (a.isImage) ImageHandling.generateThumbnail(a)
              if(req.addToAttachments(a.id.get)){
                Rest.success("attachment" -> Attachment.insertJson(a, user))
              } else Rest.serverError()
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

  def thumb(id: Int) = Action {
    Attachment.findById(id).map { attachment =>
      Ok.sendFile(attachment.thumb, true, _ => attachment.filename)
    }.getOrElse(NotFound)
  }

}
