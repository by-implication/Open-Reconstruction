package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Event extends EventGen {

  private def generate(kind: String, content: String)(implicit req: Req, user: User) = Event(
    kind = kind,
    content = Some(content),
    reqId = req.id,
    userId = user.id.toOption
  )

  private def asContent(a: Attachment) = Seq(a.filename, if(a.isImage) 1 else 0, a.id).mkString(" ")

  def signoff(govUnit: GovUnit)(implicit req: Req, user: User) = {
    generate("signoff", govUnit.name + " " + govUnit.id)
  }

  def reject(govUnit: GovUnit)(implicit req: Req, user: User) = {
    generate("reject", govUnit.name + " " + govUnit.id)
  }

  def attachment(a: Attachment)(implicit req: Req, user: User) = {
    generate("attachment", asContent(a))
  }

  def comment(content: String)(implicit req: Req, user: User) = {
    generate("comment", content)
  }

  def assign(agencyType: String, assign: Boolean, govUnit: GovUnit)(implicit req: Req, user: User) = {
    generate("assign", Seq(govUnit.name, govUnit.id, (if (assign) 1 else 0), agencyType).mkString(" "))
  }

  def newRequest()(implicit req: Req, user: User) = {
    generate("newRequest", req.description)
  }

  def disaster()(implicit req: Req, user: User) = {
    generate("disaster", req.disasterName.getOrElse("") + ":" + req.disasterType).copy(date = req.disasterDate)
  }

  def archiveAttachment(a: Attachment)(implicit req: Req, user: User) = {
    generate("archiveAttachment", asContent(a))
  }

  def unarchiveAttachment(a: Attachment) = DB.withConnection { implicit c =>
    SQL("""
      DELETE FROM events
      WHERE req_id = {reqId}
      AND event_kind = 'archiveAttachment'
      AND event_content ilike '% """ + a.id + """'
    """).on('reqId -> a.reqId).executeUpdate > 0
  }

  def editField(field: String)(implicit req: Req, user: User) = {
    val fieldValue = field match {
      case "amount" => req.amount
      case "description" => req.description
      case "location" => req.location
    }
    generate("editField", fieldValue + " " + field)
  }

  def findForRequest(id: Int)(implicit user: User): Seq[Event] = DB.withConnection { implicit c =>
    SQL("SELECT * FROM events WHERE req_id = {reqId}" +
    (if(user.isAnonymous) " AND event_kind != 'comment' " else "") +
    "ORDER BY event_date DESC"
    ).on('reqId -> id).list(simple)
  }

}

// GENERATED case class start
case class Event(
  id: Pk[Int] = NA,
  kind: String = "",
  date: Timestamp = Time.now,
  content: Option[String] = None,
  reqId: Int = 0,
  userId: Option[Int] = None
) extends EventCCGen with Entity[Event]
// GENERATED case class end
{

  def listJson = Json.obj(
    "kind" -> kind,
    "content" -> content,
    "date" -> date,
    "user" -> userId.map(User.findById(_).map(u => Json.obj(
      "id" -> u.id.get,
      "name" -> u.name
    ))),
    "govUnit" -> userId.map(User.findById(_).map(u => Json.obj(
      "id" -> u.govUnit.id.get,
      "name" -> u.govUnit.name
    )))
  )

}

// GENERATED object start
trait EventGen extends EntityCompanion[Event] {
  val simple = {
    get[Pk[Int]]("event_id") ~
    get[String]("event_kind") ~
    get[Timestamp]("event_date") ~
    get[Option[String]]("event_content") ~
    get[Int]("req_id") ~
    get[Option[Int]]("user_id") map {
      case id~kind~date~content~reqId~userId =>
        Event(id, kind, date, content, reqId, userId)
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
            event_kind,
            event_date,
            event_content,
            req_id,
            user_id
          ) VALUES (
            DEFAULT,
            {kind},
            {date},
            {content},
            {reqId},
            {userId}
          )
        """).on(
          'id -> o.id,
          'kind -> o.kind,
          'date -> o.date,
          'content -> o.content,
          'reqId -> o.reqId,
          'userId -> o.userId
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into events (
            event_id,
            event_kind,
            event_date,
            event_content,
            req_id,
            user_id
          ) VALUES (
            {id},
            {kind},
            {date},
            {content},
            {reqId},
            {userId}
          )
        """).on(
          'id -> o.id,
          'kind -> o.kind,
          'date -> o.date,
          'content -> o.content,
          'reqId -> o.reqId,
          'userId -> o.userId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Event): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update events set
        event_kind={kind},
        event_date={date},
        event_content={content},
        req_id={reqId},
        user_id={userId}
      where event_id={id}
    """).on(
      'id -> o.id,
      'kind -> o.kind,
      'date -> o.date,
      'content -> o.content,
      'reqId -> o.reqId,
      'userId -> o.userId
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

