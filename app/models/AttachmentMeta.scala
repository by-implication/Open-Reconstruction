package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object AttachmentMeta extends AttachmentMetaGen {

  // use java.math.BigDecimal taken from scala.math.BigDecimal for benefit of SqlParser
  override def insert(o: AttachmentMeta): Option[AttachmentMeta] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into attachment_metas (
            attachment_meta_id,
            attachment_meta_latitude,
            attachment_meta_longitude,
            attachment_meta_date_taken
          ) VALUES (
            DEFAULT,
            {latitude},
            {longitude},
            {dateTaken}
          )
        """).on(
          'id -> o.id,
          'latitude -> o.latitude.map(_.bigDecimal),
          'longitude -> o.longitude.map(_.bigDecimal),
          'dateTaken -> o.dateTaken
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into attachment_metas (
            attachment_meta_id,
            attachment_meta_latitude,
            attachment_meta_longitude,
            attachment_meta_date_taken
          ) VALUES (
            {id},
            {latitude},
            {longitude},
            {dateTaken}
          )
        """).on(
          'id -> o.id,
          'latitude -> o.latitude.map(_.bigDecimal),
          'longitude -> o.longitude.map(_.bigDecimal),
          'dateTaken -> o.dateTaken
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  override def update(o: AttachmentMeta): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update attachment_metas set
        attachment_meta_latitude={latitude},
        attachment_meta_longitude={longitude},
        attachment_meta_date_taken={dateTaken}
      where attachment_meta_id={id}
    """).on(
      'id -> o.id,
      'latitude -> o.latitude.map(_.bigDecimal),
      'longitude -> o.longitude.map(_.bigDecimal),
      'dateTaken -> o.dateTaken
    ).executeUpdate() > 0
  }

}

// GENERATED case class start
case class AttachmentMeta(
  id: Pk[Int] = NA,
  latitude: Option[BigDecimal] = None,
  longitude: Option[BigDecimal] = None,
  dateTaken: Option[Timestamp] = None
) extends AttachmentMetaCCGen with Entity[AttachmentMeta]
// GENERATED case class end

// GENERATED object start
trait AttachmentMetaGen extends EntityCompanion[AttachmentMeta] {
  val simple = {
    get[Pk[Int]]("attachment_meta_id") ~
    get[Option[BigDecimal]]("attachment_meta_latitude") ~
    get[Option[BigDecimal]]("attachment_meta_longitude") ~
    get[Option[Timestamp]]("attachment_meta_date_taken") map {
      case id~latitude~longitude~dateTaken =>
        AttachmentMeta(id, latitude, longitude, dateTaken)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from attachment_metas where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[AttachmentMeta] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[AttachmentMeta] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[AttachmentMeta] = findOne("attachment_meta_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[AttachmentMeta] = DB.withConnection { implicit c =>
    SQL("select * from attachment_metas limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[AttachmentMeta] = DB.withConnection { implicit c =>
    SQL("select * from attachment_metas order by attachment_meta_id").list(simple)
  }

  def insert(o: AttachmentMeta): Option[AttachmentMeta] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into attachment_metas (
            attachment_meta_id,
            attachment_meta_latitude,
            attachment_meta_longitude,
            attachment_meta_date_taken
          ) VALUES (
            DEFAULT,
            {latitude},
            {longitude},
            {dateTaken}
          )
        """).on(
          'id -> o.id,
          'latitude -> o.latitude,
          'longitude -> o.longitude,
          'dateTaken -> o.dateTaken
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into attachment_metas (
            attachment_meta_id,
            attachment_meta_latitude,
            attachment_meta_longitude,
            attachment_meta_date_taken
          ) VALUES (
            {id},
            {latitude},
            {longitude},
            {dateTaken}
          )
        """).on(
          'id -> o.id,
          'latitude -> o.latitude,
          'longitude -> o.longitude,
          'dateTaken -> o.dateTaken
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: AttachmentMeta): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update attachment_metas set
        attachment_meta_latitude={latitude},
        attachment_meta_longitude={longitude},
        attachment_meta_date_taken={dateTaken}
      where attachment_meta_id={id}
    """).on(
      'id -> o.id,
      'latitude -> o.latitude,
      'longitude -> o.longitude,
      'dateTaken -> o.dateTaken
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from attachment_metas where attachment_meta_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait AttachmentMetaCCGen {
  val companion = AttachmentMeta
}
// GENERATED object end

