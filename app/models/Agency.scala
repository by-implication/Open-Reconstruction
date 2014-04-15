package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.Play.current
import recon.support._

object Agency extends AgencyGen {
}

// GENERATED case class start
case class Agency(
  id: Pk[Int] = NA,
  name: String = ""
) extends AgencyCCGen with Entity[Agency]
// GENERATED case class end

// GENERATED object start
trait AgencyGen extends EntityCompanion[Agency] {
  val simple = {
    get[Pk[Int]]("agency_id") ~
    get[String]("agency_name") map {
      case id~name =>
        Agency(id, name)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from agencys where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Agency] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Agency] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Agency] = findOne("agency_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Agency] = DB.withConnection { implicit c =>
    SQL("select * from agencys limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Agency): Option[Agency] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into agencys (
            agency_id,
            agency_name
          ) VALUES (
            DEFAULT,
            {name}
          )
        """).on(
          'id -> o.id,
          'name -> o.name
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into agencys (
            agency_id,
            agency_name
          ) VALUES (
            {id},
            {name}
          )
        """).on(
          'id -> o.id,
          'name -> o.name
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Agency): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update agencys set
        agency_name={name}
      where agency_id={id}
    """).on(
      'id -> o.id,
      'name -> o.name
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from agencys where agency_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait AgencyCCGen {
  val companion = Agency
}
// GENERATED object end

