package recon.models

import anorm._
import anorm.SqlParser._
import java.io.File
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Attachment extends AttachmentGen {

  def insertJson(attachment: Attachment, uploader: User) = Json.obj(
    "id" -> attachment.id.get,
    "filename" -> attachment.filename,
    "dateUploaded" -> attachment.dateUploaded,
    "uploader" -> Json.obj(
      "id" -> uploader.id.get,
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
  isImage: Boolean = true
) extends AttachmentCCGen with Entity[Attachment]
// GENERATED case class end
{
  
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
    get[Boolean]("attachment_image") map {
      case id~dateUploaded~filename~uploaderId~isImage =>
        Attachment(id, dateUploaded, filename, uploaderId, isImage)
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

  def insert(o: Attachment): Option[Attachment] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into attachments (
            attachment_id,
            attachment_date_uploaded,
            attachment_filename,
            uploader_id,
            attachment_image
          ) VALUES (
            DEFAULT,
            {dateUploaded},
            {filename},
            {uploaderId},
            {isImage}
          )
        """).on(
          'id -> o.id,
          'dateUploaded -> o.dateUploaded,
          'filename -> o.filename,
          'uploaderId -> o.uploaderId,
          'isImage -> o.isImage
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
            attachment_image
          ) VALUES (
            {id},
            {dateUploaded},
            {filename},
            {uploaderId},
            {isImage}
          )
        """).on(
          'id -> o.id,
          'dateUploaded -> o.dateUploaded,
          'filename -> o.filename,
          'uploaderId -> o.uploaderId,
          'isImage -> o.isImage
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
        attachment_image={isImage}
      where attachment_id={id}
    """).on(
      'id -> o.id,
      'dateUploaded -> o.dateUploaded,
      'filename -> o.filename,
      'uploaderId -> o.uploaderId,
      'isImage -> o.isImage
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

