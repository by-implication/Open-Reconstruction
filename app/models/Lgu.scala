package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Lgu extends LguGen {
  
  val REGIONS: Map[Int, String] = Map(
    1 -> "Region 1",
    2 -> "Region 2",
    3 -> "Region 3",
    4 -> "Region 4",
    5 -> "Region 5"
  )

  def jsonList = DB.withConnection { implicit c =>
    Json.toJson(SQL("""
      SELECT * FROM lgus LEFT join gov_units ON lgu_id = gov_unit_id
    """).list(GovUnit.simple ~ simple map(flatten)).map {
      case (govUnit, lgu) => govUnit.toJson ++ Json.obj(
        "parentRegion" -> lgu.parentRegionId,
        "parentLGU" -> lgu.parentLguId,
        "level" -> lgu.level
      )
    })
  }

}

// GENERATED case class start
case class Lgu(
  id: Pk[Int] = NA,
  level: Int = 0,
  parentLguId: Option[Int] = None,
  parentRegionId: Option[Int] = None,
  municipalityClass: Option[Int] = None
) extends LguCCGen with Entity[Lgu]
// GENERATED case class end

// GENERATED object start
trait LguGen extends EntityCompanion[Lgu] {
  val simple = {
    get[Pk[Int]]("lgu_id") ~
    get[Int]("lgu_level") ~
    get[Option[Int]]("parent_lgu_id") ~
    get[Option[Int]]("parent_region_id") ~
    get[Option[Int]]("lgu_municipality_class") map {
      case id~level~parentLguId~parentRegionId~municipalityClass =>
        Lgu(id, level, parentLguId, parentRegionId, municipalityClass)
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
            parent_lgu_id,
            parent_region_id,
            lgu_municipality_class
          ) VALUES (
            DEFAULT,
            {level},
            {parentLguId},
            {parentRegionId},
            {municipalityClass}
          )
        """).on(
          'id -> o.id,
          'level -> o.level,
          'parentLguId -> o.parentLguId,
          'parentRegionId -> o.parentRegionId,
          'municipalityClass -> o.municipalityClass
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into lgus (
            lgu_id,
            lgu_level,
            parent_lgu_id,
            parent_region_id,
            lgu_municipality_class
          ) VALUES (
            {id},
            {level},
            {parentLguId},
            {parentRegionId},
            {municipalityClass}
          )
        """).on(
          'id -> o.id,
          'level -> o.level,
          'parentLguId -> o.parentLguId,
          'parentRegionId -> o.parentRegionId,
          'municipalityClass -> o.municipalityClass
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Lgu): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update lgus set
        lgu_level={level},
        parent_lgu_id={parentLguId},
        parent_region_id={parentRegionId},
        lgu_municipality_class={municipalityClass}
      where lgu_id={id}
    """).on(
      'id -> o.id,
      'level -> o.level,
      'parentLguId -> o.parentLguId,
      'parentRegionId -> o.parentRegionId,
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
