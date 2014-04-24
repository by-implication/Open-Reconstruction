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
      SELECT * FROM lgus LEFT join gov_units ON lgu_id = gov_unit_id
    """).list(GovUnit.simple ~ simple map(flatten)).map {
      case (govUnit, lgu) => govUnit.toJson ++ Json.obj("parentId" -> lgu.parentLguId)
    })
  }

}

// GENERATED case class start
case class Lgu(
  id: Pk[Int] = NA,
  level: Int = 0,
  parentRegion: Int = 0,
  parentLguId: Option[Int] = None,
  municipalityClass: Option[Int] = None
) extends LguCCGen with Entity[Lgu]
// GENERATED case class end

// GENERATED object start
trait LguGen extends EntityCompanion[Lgu] {
  val simple = {
    get[Pk[Int]]("lgu_id") ~
    get[Int]("lgu_level") ~
    get[Int]("lgu_parent_region") ~
    get[Option[Int]]("parent_lgu_id") ~
    get[Option[Int]]("lgu_municipality_class") map {
      case id~level~parentRegion~parentLguId~municipalityClass =>
        Lgu(id, level, parentRegion, parentLguId, municipalityClass)
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
            lgu_level,
            lgu_parent_region,
            parent_lgu_id,
            lgu_municipality_class
          ) VALUES (
            DEFAULT,
            {level},
            {parentRegion},
            {parentLguId},
            {municipalityClass}
          )
        """).on(
          'id -> o.id,
          'level -> o.level,
          'parentRegion -> o.parentRegion,
          'parentLguId -> o.parentLguId,
          'municipalityClass -> o.municipalityClass
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into lgus (
            lgu_id,
            lgu_level,
            lgu_parent_region,
            parent_lgu_id,
            lgu_municipality_class
          ) VALUES (
            {id},
            {level},
            {parentRegion},
            {parentLguId},
            {municipalityClass}
          )
        """).on(
          'id -> o.id,
          'level -> o.level,
          'parentRegion -> o.parentRegion,
          'parentLguId -> o.parentLguId,
          'municipalityClass -> o.municipalityClass
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Lgu): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update lgus set
        lgu_level={level},
        lgu_parent_region={parentRegion},
        parent_lgu_id={parentLguId},
        lgu_municipality_class={municipalityClass}
      where lgu_id={id}
    """).on(
      'id -> o.id,
      'level -> o.level,
      'parentRegion -> o.parentRegion,
      'parentLguId -> o.parentLguId,
      'municipalityClass -> o.municipalityClass
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

