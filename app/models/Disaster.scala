package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Disaster extends DisasterGen {
}

// GENERATED case class start
case class Disaster(
  id: Pk[Int] = NA,
  kind: DisasterType = DisasterType.EARTHQUAKE,
  name: String = "",
  date: Timestamp = Time.now,
  cause: Option[String] = None
) extends DisasterCCGen with Entity[Disaster]
// GENERATED case class end

// GENERATED object start
trait DisasterGen extends EntityCompanion[Disaster] {
  val simple = {
    get[Pk[Int]]("disaster_id") ~
    get[DisasterType]("disaster_kind") ~
    get[String]("disaster_name") ~
    get[Timestamp]("disaster_date") ~
    get[Option[String]]("disaster_cause") map {
      case id~kind~name~date~cause =>
        Disaster(id, kind, name, date, cause)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from disasters where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Disaster] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Disaster] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Disaster] = findOne("disaster_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Disaster] = DB.withConnection { implicit c =>
    SQL("select * from disasters limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Disaster): Option[Disaster] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into disasters (
            disaster_id,
            disaster_kind,
            disaster_name,
            disaster_date,
            disaster_cause
          ) VALUES (
            DEFAULT,
            {kind},
            {name},
            {date},
            {cause}
          )
        """).on(
          'id -> o.id,
          'kind -> o.kind,
          'name -> o.name,
          'date -> o.date,
          'cause -> o.cause
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into disasters (
            disaster_id,
            disaster_kind,
            disaster_name,
            disaster_date,
            disaster_cause
          ) VALUES (
            {id},
            {kind},
            {name},
            {date},
            {cause}
          )
        """).on(
          'id -> o.id,
          'kind -> o.kind,
          'name -> o.name,
          'date -> o.date,
          'cause -> o.cause
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Disaster): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update disasters set
        disaster_kind={kind},
        disaster_name={name},
        disaster_date={date},
        disaster_cause={cause}
      where disaster_id={id}
    """).on(
      'id -> o.id,
      'kind -> o.kind,
      'name -> o.name,
      'date -> o.date,
      'cause -> o.cause
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from disasters where disaster_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait DisasterCCGen {
  val companion = Disaster
}
// GENERATED object end

