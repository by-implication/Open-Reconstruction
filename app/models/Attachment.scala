package recon.models

import anorm._
import anorm.SqlParser._
import java.io.File
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.libs.Files.TemporaryFile
import play.api.mvc.MultipartFormData.FilePart
import play.api.Play.current
import recon.support._
import scala.collection.JavaConversions._
import scala.concurrent.duration._

object Attachment extends AttachmentGen {

  def insertJson(attachment: Attachment, uploader: User) = Json.obj(
    "id" -> attachment.id,
    "filename" -> attachment.filename,
    "dateUploaded" -> attachment.dateUploaded,
    "uploader" -> Json.obj(
      "id" -> uploader.id,
      "name" -> uploader.name
    )
  )

}

// GENERATED case class start
case class Attachment(
  id: Pk[Int] = NA,
  dateUploaded: Timestamp = Time.now,
  filename: String = "",
  uploaderId: Int = 0,
  isImage: Boolean = true,
  reqId: Int = 0
) extends AttachmentCCGen with Entity[Attachment]
// GENERATED case class end
{

  lazy val uploader = User.findById(uploaderId).get

  override def insertJson = Attachment.insertJson(this, uploader)

  lazy val req = Req.findById(reqId).get

  def archive(archive: Boolean): Boolean = DB.withConnection { implicit c =>
    SQL("""
      UPDATE reqs SET req_attachment_ids = array_""" +
      (if(archive) "remove" else "append") + """
      (req_attachment_ids, {attachmentId})
      WHERE req_id = {reqId}
    """).on('reqId -> reqId, 'attachmentId -> id).executeUpdate() > 0
  }
  
  private lazy val folderSeq = Seq("attachments", dateUploaded.toString.split(" ")(0))

  lazy val path = (folderSeq :+ id.toString).mkString(File.separator)

  lazy val file = new File(path)

  lazy val thumbPath = {
    (folderSeq :+ ("t" + id)).mkString(File.separator)
  }

  lazy val thumb = new File(thumbPath)

}

// GENERATED object start
trait AttachmentGen extends EntityCompanion[Attachment] {
  val simple = {
    get[Pk[Int]]("attachment_id") ~
    get[Timestamp]("attachment_date_uploaded") ~
    get[String]("attachment_filename") ~
    get[Int]("uploader_id") ~
    get[Boolean]("attachment_image") ~
    get[Int]("req_id") map {
      case id~dateUploaded~filename~uploaderId~isImage~reqId =>
        Attachment(id, dateUploaded, filename, uploaderId, isImage, reqId)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from attachments where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Attachment] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Attachment] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Attachment] = findOne("attachment_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Attachment] = DB.withConnection { implicit c =>
    SQL("select * from attachments limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[Attachment] = DB.withConnection { implicit c =>
    SQL("select * from attachments order by attachment_id").list(simple)
  }

  def insert(o: Attachment): Option[Attachment] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into attachments (
            attachment_id,
            attachment_date_uploaded,
            attachment_filename,
            uploader_id,
            attachment_image,
            req_id
          ) VALUES (
            DEFAULT,
            {dateUploaded},
            {filename},
            {uploaderId},
            {isImage},
            {reqId}
          )
        """).on(
          'id -> o.id,
          'dateUploaded -> o.dateUploaded,
          'filename -> o.filename,
          'uploaderId -> o.uploaderId,
          'isImage -> o.isImage,
          'reqId -> o.reqId
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into attachments (
            attachment_id,
            attachment_date_uploaded,
            attachment_filename,
            uploader_id,
            attachment_image,
            req_id
          ) VALUES (
            {id},
            {dateUploaded},
            {filename},
            {uploaderId},
            {isImage},
            {reqId}
          )
        """).on(
          'id -> o.id,
          'dateUploaded -> o.dateUploaded,
          'filename -> o.filename,
          'uploaderId -> o.uploaderId,
          'isImage -> o.isImage,
          'reqId -> o.reqId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Attachment): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update attachments set
        attachment_date_uploaded={dateUploaded},
        attachment_filename={filename},
        uploader_id={uploaderId},
        attachment_image={isImage},
        req_id={reqId}
      where attachment_id={id}
    """).on(
      'id -> o.id,
      'dateUploaded -> o.dateUploaded,
      'filename -> o.filename,
      'uploaderId -> o.uploaderId,
      'isImage -> o.isImage,
      'reqId -> o.reqId
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from attachments where attachment_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait AttachmentCCGen {
  val companion = Attachment
}
// GENERATED object end

case class Bucket(key: String){

  case class BFile(typ: String, filename: String){
    private lazy val folderPath = bucketFolderPath :+ typ
    lazy val path = (folderPath :+ filename).mkString(File.separator)
    lazy val file = new File(path)
    lazy val thumbPath = (folderPath.dropRight(1) ++ Seq("thumbs", filename)).mkString(File.separator)
    lazy val thumb = new File(thumbPath)
  }

  lazy val bucketFolderPath = Seq("buckets", key)

  def getFile(typ: String, filename: String) = BFile(typ, filename)

  def add(typ: String, upload: FilePart[TemporaryFile]): Boolean = {
    try {
      val bf = getFile(typ, upload.filename)
      upload.ref.moveTo(bf.file, true)
      if(typ == "img"){
        bf.thumb.getParentFile().mkdirs()
        ImageHandling.generateThumbnail(bf.path, bf.thumbPath)
      }
      true
    } catch {
      case t: Throwable => {
        play.Logger.error(t.toString)
        false
      }
    }
  }

  private def files(typ: String): Seq[BFile] = {
    val dir = new File((bucketFolderPath :+ typ).mkString(File.separator))
    if(dir.exists){
      dir.list().map(f => BFile(typ, f))
    } else {
      Seq.empty[BFile]
    }
  }

  private def delete = Redis.xaction { r =>
    r.del(key)
    deleteFile(new File(bucketFolderPath.mkString(File.separator)))
  }

  def dumpTo(req: Req): Boolean = {

    def moveFile(src: File, dst: File) = {
      dst.getParentFile().mkdirs()
      if(!src.renameTo(dst)){
        play.Logger.error("Failed to move file: " + src.getAbsolutePath + " -> " + dst.getAbsolutePath)
      }
    }

    val attachmentIds: Seq[Int] = Seq("img", "doc").map { typ =>
      files(typ).map { f =>
        val isImage = typ == "img"
        Attachment(filename = f.filename, uploaderId = req.authorId, isImage = isImage, reqId = req.id)
            .create().map { a =>

          moveFile(f.file, a.file)
          if(isImage) moveFile(f.thumb, a.thumb)

          Event.attachment(a)(req, req.author).create().getOrElse(Rest.serverError())

          a.id

        }
      }
    }.flatten.flatten.map(pkToInt)

    req.copy(attachmentIds = attachmentIds).save()

    delete

  }

}

object Bucket {

  private def ALPHANUM = ('a' to 'z') ++ ('A' to 'Z') ++ ('0' to '9')
  private def TIMEOUT = 1.day
  private def generateKey = generateRandomString(10, ALPHANUM)

  def getAvailableKey: String = Redis.xaction { r =>
    val key = generateKey
    val redisKey = "bucket-" + key
    if(r.exists(redisKey)){
      getAvailableKey
    } else {
      r.set(redisKey, true)
      r.expire(redisKey, TIMEOUT.toSeconds.toInt)
      key
    }
  }

}
