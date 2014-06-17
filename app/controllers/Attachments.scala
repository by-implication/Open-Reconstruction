package controllers

import java.io.File
import play.api._
import play.api.libs.Files.TemporaryFile
import play.api.libs.json.Json
import play.api.mvc._
import recon.models._
import recon.support._

object Attachments extends Controller with Secured {

  def bucketThumb(key: String, typ: String, filename: String) = UserAction(){ implicit user => implicit request =>
    val bf = Bucket(key).getFile(typ, filename)
    if(bf.thumb.exists){
      Ok.sendFile(bf.thumb, true, _ => bf.filename)
    } else NotFound
  }

  private def bucketGet(inline: Boolean)(key: String, typ: String, filename: String) = Action {
    val bf = Bucket(key).getFile(typ, filename)
    if(bf.file.exists){      
      Ok.sendFile(bf.file, inline, _ => bf.filename)
    } else NotFound
  }

  def bucketPreview = bucketGet(true) _
  def bucketDownload = bucketGet(false) _

  def addToBucket(key: String, typ: String) = UserAction(parse.multipartFormData){ implicit user => implicit request =>
    request.body.file("file").map { upload =>
      if(Bucket(key).add(typ, upload)){
        Rest.success(
          "key" -> key,
          "filename" -> upload.filename,
          "dateUploaded" -> Time.now,
          "uploader" -> Json.obj(
            "id" -> user.id,
            "name" -> user.name
          )
        )
      } else {
        Rest.serverError()
      }
    }.getOrElse(Rest.NO_FILE)
  }

  def add(id: Int, typ: String) = UserAction(parse.multipartFormData){ implicit user => implicit request =>
    request.body.file("file").map { upload =>
      Req.findById(id).map { implicit req =>
        if(user.canEditRequest(req)){
          Attachment(filename = upload.filename, uploaderId = user.id, isImage = typ == "img", reqId = id)
              .create().map { a =>
            a.file.getParentFile().mkdirs()
            upload.ref.moveTo(a.file, true)
            if (a.isImage) ImageHandling.generateAttachmentThumbnail(a)
            if(req.addToAttachments(a.id)){
              Event.attachment(a).create().map { e => Rest.success(
                "attachment" -> Attachment.insertJson(a, user),
                "event" -> e.listJson
              )}.getOrElse(Rest.serverError())
            } else Rest.serverError()
          }.getOrElse(Rest.serverError())
        } else Rest.unauthorized()
      }.getOrElse(Rest.notFound())
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

  private def _archive(archive: Boolean)(id: Int) = UserAction(){ implicit user => implicit request =>
    Attachment.findById(id).map { a =>
      implicit val req = a.req
      if(user.canEditRequest(req)){
        if(a.archive(archive)){
          if(archive){
            Event.archiveAttachment(a).create().map { e =>
              Rest.success("event" -> e.listJson)
            }.getOrElse(Rest.serverError())
          } else if(Event.unarchiveAttachment(a)){
            Rest.success("doc" -> a.insertJson)
          } else Rest.serverError()
        } else Rest.serverError()
      } else Rest.unauthorized()
    }.getOrElse(Rest.notFound())
  }

  def archive = _archive(true) _
  def unarchive = _archive(false) _

}
