package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.Play.current
import recon.support._

object Event extends EventGen {
}

// GENERATED case class start
case class Event(
  id: Pk[Int] = NA,
  date: Timestamp = Time.now,
  projectId: Int = 0
) extends EventCCGen with Entity[Event]
// GENERATED case class end

// GENERATED object start
trait EventGen extends EntityCompanion[Event] {
  val simple = {
    get[Pk[Int]]("event_id") ~
    get[Timestamp]("event_date") ~
    get[Int]("project_id") map {
      case id~date~projectId =>
        Event(id, date, projectId)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from events where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Event] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Event] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Event] = findOne("event_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Event] = DB.withConnection { implicit c =>
    SQL("select * from events limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Event): Option[Event] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into events (
            event_id,
            event_date,
            project_id
          ) VALUES (
            DEFAULT,
            {date},
            {projectId}
          )
        """).on(
          'id -> o.id,
          'date -> o.date,
          'projectId -> o.projectId
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into events (
            event_id,
            event_date,
            project_id
          ) VALUES (
            {id},
            {date},
            {projectId}
          )
        """).on(
          'id -> o.id,
          'date -> o.date,
          'projectId -> o.projectId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Event): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update events set
        event_date={date},
        project_id={projectId}
      where event_id={id}
    """).on(
      'id -> o.id,
      'date -> o.date,
      'projectId -> o.projectId
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from events where event_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait EventCCGen {
  val companion = Event
}
// GENERATED object end

