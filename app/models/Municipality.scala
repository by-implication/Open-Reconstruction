package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Municipality extends MunicipalityGen {
}

// GENERATED case class start
case class Municipality(
  id: Pk[Int] = NA,
  nthclass: Int = 0
) extends MunicipalityCCGen with Entity[Municipality]
// GENERATED case class end

// GENERATED object start
trait MunicipalityGen extends EntityCompanion[Municipality] {
  val simple = {
    get[Pk[Int]]("municipality_id") ~
    get[Int]("municipality_nthclass") map {
      case id~nthclass =>
        Municipality(id, nthclass)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from municipalitys where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Municipality] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Municipality] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Municipality] = findOne("municipality_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Municipality] = DB.withConnection { implicit c =>
    SQL("select * from municipalitys limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Municipality): Option[Municipality] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into municipalitys (
            municipality_id,
            municipality_nthclass
          ) VALUES (
            DEFAULT,
            {nthclass}
          )
        """).on(
          'id -> o.id,
          'nthclass -> o.nthclass
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into municipalitys (
            municipality_id,
            municipality_nthclass
          ) VALUES (
            {id},
            {nthclass}
          )
        """).on(
          'id -> o.id,
          'nthclass -> o.nthclass
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Municipality): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update municipalitys set
        municipality_nthclass={nthclass}
      where municipality_id={id}
    """).on(
      'id -> o.id,
      'nthclass -> o.nthclass
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from municipalitys where municipality_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait MunicipalityCCGen {
  val companion = Municipality
}
// GENERATED object end

