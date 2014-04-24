package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

case class Region(
  name: String,
  provinces: Seq[Province] = Seq.empty[Province]
){
  def toJson = Json.obj("name" -> name, "provinces" -> Json.toJson(provinces.map(_.toJson)))
}

case class Province(
  id: Int,
  name: String
){
  def save() = {
    Lgu.PROVINCES += (id -> this)
    this
  }
  def toJson = Json.obj("id" -> id, "name" -> name)
}

object Lgu extends LguGen {

  var PROVINCES: Map[Int, Province] = Map()
  
  val REGIONS: Seq[Region] = Seq(
    Region("Region 1", Seq(
      Province(-1, "Province 1.1").save(),
      Province(-2, "Province 1.2").save(),
      Province(-3, "Province 1.3").save()
    )), Region("Region 2", Seq(
      Province(-4, "Province 2.1").save(),
      Province(-5, "Province 2.2").save(),
      Province(-6, "Province 2.3").save()
    )), Region("Region 3", Seq(
      Province(-7, "Province 3.1").save(),
      Province(-8, "Province 3.2").save(),
      Province(-9, "Province 3.3").save()
    ))
  )

  def jsonList = DB.withConnection { implicit c =>
    Json.toJson(SQL("""
      SELECT * FROM lgus LEFT JOIN agencys ON lgu_id = agency_id
    """).list(Agency.simple ~ simple map(flatten)).map {
      case (agency, lgu) => agency.toJson ++ Json.obj("parentId" -> lgu.parentId)
    })
  }

}

// GENERATED case class start
case class Lgu(
  id: Pk[Int] = NA,
  parentId: Int = 0
) extends LguCCGen with Entity[Lgu]
// GENERATED case class end

// GENERATED object start
trait LguGen extends EntityCompanion[Lgu] {
  val simple = {
    get[Pk[Int]]("lgu_id") ~
    get[Int]("parent_id") map {
      case id~parentId =>
        Lgu(id, parentId)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from lgus where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Lgu] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Lgu] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Lgu] = findOne("lgu_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Lgu] = DB.withConnection { implicit c =>
    SQL("select * from lgus limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Lgu): Option[Lgu] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into lgus (
            lgu_id,
            parent_id
          ) VALUES (
            DEFAULT,
            {parentId}
          )
        """).on(
          'id -> o.id,
          'parentId -> o.parentId
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into lgus (
            lgu_id,
            parent_id
          ) VALUES (
            {id},
            {parentId}
          )
        """).on(
          'id -> o.id,
          'parentId -> o.parentId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Lgu): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update lgus set
        parent_id={parentId}
      where lgu_id={id}
    """).on(
      'id -> o.id,
      'parentId -> o.parentId
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from lgus where lgu_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait LguCCGen {
  val companion = Lgu
}
// GENERATED object end

