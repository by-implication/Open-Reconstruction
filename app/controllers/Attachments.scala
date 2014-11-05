package controllers

import com.thebuzzmedia.exiftool._
import com.thebuzzmedia.exiftool.ExifTool._
import java.io.File
import java.sql.Timestamp
import play.api._
import play.api.libs.Files.TemporaryFile
import play.api.libs.json.{Json, JsNull}
import play.api.mvc._
import recon.models._
import recon.support._

object Attachments extends Controller with Secured {

  def getNewBucketKey = UserAction(){ implicit user => implicit request =>
    Rest.success("bucketKey" -> Bucket.getAvailableKey)
  }

  def bucketThumb(key: String, requirementId: Int, filename: String) = UserAction(){ implicit user => implicit request =>
    Requirement.findById(requirementId).map { requirement =>
      val bf = Bucket(key).getFile(requirement, filename)
      if(bf.thumb.exists){
        Ok.sendFile(bf.thumb, true, _ => bf.filename)
      } else NotFound
    }.getOrElse(NotFound)
  }

  private def bucketGet(inline: Boolean)(key: String, requirementId: Int, filename: String) = Action {
    Requirement.findById(requirementId).map { requirement =>
      val bf = Bucket(key).getFile(requirement, filename)
      if(bf.file.exists){      
        Ok.sendFile(bf.file, inline, _ => bf.filename)
      } else NotFound
    }.getOrElse(NotFound)
  }

  def bucketPreview = bucketGet(true) _
  def bucketDownload = bucketGet(false) _

  def addToBucket(key: String, requirementId: Int) = UserAction(parse.multipartFormData){ implicit user => implicit request =>
    request.body.file("file").map { upload =>
      Requirement.findById(requirementId).map { requirement =>
      val bucket = Bucket(key)
        if(bucket.add(requirement, upload)){
          val meta = {
            if (requirement.isImage || requirement.name == "Photograph(s)") {
              val photo = bucket.getFile(requirement, upload.filename).file
              val exifTool = new ExifTool()
              val exifData = exifTool.getImageMeta(photo, Tag.GPS_LATITUDE, Tag.GPS_LONGITUDE)

              if(exifData.containsKey(Tag.GPS_LATITUDE) && exifData.containsKey(Tag.GPS_LONGITUDE)) {
                Json.obj(
                  "lat" -> exifData.get(Tag.GPS_LATITUDE),
                  "lng" -> exifData.get(Tag.GPS_LONGITUDE)
                )
              } else JsNull
            } else JsNull
          }
          Rest.success(
            "key" -> key,
            "isImage" -> requirement.isImage,
            "filename" -> upload.filename,
            "dateUploaded" -> Time.now,
            "requirementId" -> requirementId,
            "uploader" -> Json.obj(
              "id" -> user.id,
              "name" -> user.name
            ),
            "metadata" -> meta
          )
        } else {
          Rest.serverError()
        }
      }.getOrElse(Rest.notFound())
    }.getOrElse(Rest.NO_FILE)
  }

  def add(id: Int, requirementId: Int) = UserAction(parse.multipartFormData){ implicit user => implicit request =>
    request.body.file("file").map { upload =>
      Req.findById(id).map { implicit req =>
        if(user.canEditRequest(req)){
          Requirement.findById(requirementId).map { requirement =>
            Attachment(filename = upload.filename, uploaderId = user.id, reqId = id, requirementId = requirementId)
                .create().map { a =>
              a.file.getParentFile().mkdirs()
              upload.ref.moveTo(a.file, true)
              if (requirement.isImage) ImageHandling.generateAttachmentThumbnail(a)
              if(req.addToAttachments(a.id)){
                Event.attachment(a).create().map { e => Rest.success(
                  "attachment" -> Attachment.insertJson(a, user),
                  "event" -> e.listJson()
                )}.getOrElse(Rest.serverError())
              } else Rest.serverError()
            }.getOrElse(Rest.serverError())
          }.getOrElse(Rest.notFound())
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
              Rest.success("event" -> e.listJson())
            }.getOrElse(Rest.serverError())
          } else if(Event.unarchiveAttachment(a)){
            Rest.success("attachment" -> a.insertJson)
          } else Rest.serverError()
        } else Rest.serverError()
      } else Rest.unauthorized()
    }.getOrElse(Rest.notFound())
  }

  def archive = _archive(true) _
  def unarchive = _archive(false) _

}
