package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Geotag extends GeotagGen {
}

// GENERATED case class start
case class Geotag(
  id: Pk[Int] = NA,
  latitude: Option[String] = None,
  longitude: Option[String] = None
) extends GeotagCCGen with Entity[Geotag]
// GENERATED case class end

// GENERATED object start
trait GeotagGen extends EntityCompanion[Geotag] {
  val simple = {
    get[Pk[Int]]("geotag_id") ~
    get[Option[String]]("geotag_latitude") ~
    get[Option[String]]("geotag_longitude") map {
      case id~latitude~longitude =>
        Geotag(id, latitude, longitude)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from geotags where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Geotag] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Geotag] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Geotag] = findOne("geotag_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Geotag] = DB.withConnection { implicit c =>
    SQL("select * from geotags limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[Geotag] = DB.withConnection { implicit c =>
    SQL("select * from geotags order by geotag_id").list(simple)
  }

  def insert(o: Geotag): Option[Geotag] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into geotags (
            geotag_id,
            geotag_latitude,
            geotag_longitude
          ) VALUES (
            DEFAULT,
            {latitude},
            {longitude}
          )
        """).on(
          'id -> o.id,
          'latitude -> o.latitude,
          'longitude -> o.longitude
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into geotags (
            geotag_id,
            geotag_latitude,
            geotag_longitude
          ) VALUES (
            {id},
            {latitude},
            {longitude}
          )
        """).on(
          'id -> o.id,
          'latitude -> o.latitude,
          'longitude -> o.longitude
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Geotag): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update geotags set
        geotag_latitude={latitude},
        geotag_longitude={longitude}
      where geotag_id={id}
    """).on(
      'id -> o.id,
      'latitude -> o.latitude,
      'longitude -> o.longitude
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from geotags where geotag_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait GeotagCCGen {
  val companion = Geotag
}
// GENERATED object end

