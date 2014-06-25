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
  disasterTypeId: Int = 1,
  date: Timestamp = Time.now,
  name: Option[String] = None
) extends DisasterCCGen with Entity[Disaster]
// GENERATED case class end

// GENERATED object start
trait DisasterGen extends EntityCompanion[Disaster] {
  val simple = {
    get[Pk[Int]]("disaster_id") ~
    get[Int]("disaster_type_id") ~
    get[Timestamp]("disaster_date") ~
    get[Option[String]]("disaster_name") map {
      case id~disasterTypeId~date~name =>
        Disaster(id, disasterTypeId, date, name)
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

  def listAll(): Seq[Disaster] = DB.withConnection { implicit c =>
    SQL("select * from disasters order by disaster_id").list(simple)
  }

  def insert(o: Disaster): Option[Disaster] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into disasters (
            disaster_id,
            disaster_type_id,
            disaster_date,
            disaster_name
          ) VALUES (
            DEFAULT,
            {disasterTypeId},
            {date},
            {name}
          )
        """).on(
          'id -> o.id,
          'disasterTypeId -> o.disasterTypeId,
          'date -> o.date,
          'name -> o.name
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into disasters (
            disaster_id,
            disaster_type_id,
            disaster_date,
            disaster_name
          ) VALUES (
            {id},
            {disasterTypeId},
            {date},
            {name}
          )
        """).on(
          'id -> o.id,
          'disasterTypeId -> o.disasterTypeId,
          'date -> o.date,
          'name -> o.name
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Disaster): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update disasters set
        disaster_type_id={disasterTypeId},
        disaster_date={date},
        disaster_name={name}
      where disaster_id={id}
    """).on(
      'id -> o.id,
      'disasterTypeId -> o.disasterTypeId,
      'date -> o.date,
      'name -> o.name
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

