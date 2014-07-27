package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Event extends EventGen {

  def feed(page: Int, pageLimit: Int)(implicit user: User) = DB.withConnection { implicit c =>

    var conds = Seq.empty[String]

    if(!user.isSuperAdmin){
      
      conds :+= ("""
        WHERE assessing_agency_id = {govUnitId}
        OR implementing_agency_id = {govUnitId}
        OR executing_agency_id = {govUnitId}
      """)

      if(user.isOP){
        conds :+= "req_level >= 3"
      } else if(user.isDBM){
        conds :+= "req_level >= 4"
      } else if(user.lguOpt.isDefined){
        conds :+= "gov_unit_id = {govUnitId}"
      }

    }

    val r = SQL("""
      SELECT *, COUNT(*) OVER() FROM events
      NATURAL LEFT JOIN reqs
    """ + conds.mkString(" OR ") + """
      ORDER BY event_date DESC
      LIMIT {limit}
      OFFSET {offset}
    """).on(
      'govUnitId -> user.govUnitId,
      'limit -> pageLimit,
      'offset -> ((page-1) * pageLimit)
    )

    val events = r.list(simple)
    val reqs = r.list(Req.simple)
    val count: Long = r.list(get[Long]("count")).headOption.getOrElse(0)

    (events.zip(reqs), count)

  }

  private def generate(kind: String, content: String, legacy: Boolean = false)(implicit req: Req, user: User) = Event(
    kind = kind,
    content = Some(content),
    reqId = req.id,
    userId = user.id.toOption,
    isLegacy = legacy
  )

  private def asContent(a: Attachment) = Seq(a.filename, a.requirementId, a.id).mkString(" ")

  def reqt(reqtId: Int, remove: Boolean = false)(implicit req: Req, user: User) = {
    val op = if (remove) "remove" else "add"
    generate("reqt", reqtId + " " + op)
  }

  def legacyEdit()(implicit req: Req, user: User) = {
    generate("legacyEdit", Seq(req.level, req.date.getTime(), req.saroNo.getOrElse("")).mkString(" "), true)
  }

  def signoff(govUnit: GovUnit)(implicit req: Req, user: User) = {
    generate("signoff", govUnit.name + " " + govUnit.id)
  }

  def reject(govUnit: GovUnit)(implicit req: Req, user: User) = {
    generate("reject", govUnit.name + " " + govUnit.id)
  }

  def addProject(project: Project)(implicit req: Req, user: User) = {
    generate("addProject", project.name + " " + project.id)
  }

  def attachment(a: Attachment)(implicit req: Req, user: User) = {
    generate("attachment", asContent(a))
  }

  def comment(content: String)(implicit req: Req, user: User) = {
    generate("comment", content)
  }

  def assign(agencyType: String, govUnit: Option[GovUnit])(implicit req: Req, user: User) = {
    val params = govUnit.map( g => Seq(g.name, g.id, agencyType) ).getOrElse(Seq(0, agencyType))
    generate("assign", params.mkString(" "))
  }

  def newRequest()(implicit req: Req, user: User) = {
    generate("newRequest", req.description)
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
      case "disaster" => List(
        req.disaster.name.getOrElse(""),
        req.disaster.disasterTypeId,
        req.disaster.date.getTime()
      ).mkString(" ")
    }
    generate("editField", fieldValue + " " + field)
  }

  def findForRequest(id: Int)(implicit user: User): Seq[Event] = DB.withConnection { implicit c =>
    
    val r = SQL("SELECT * FROM events WHERE req_id = {reqId}" +
    (if(user.isAnon) " AND event_kind != 'comment' " else "") +
    """
      AND NOT event_legacy
      ORDER BY event_date DESC
    """
    ).on('reqId -> id).list(simple)

    val req = Req.findById(id).get
    val disasterEvent = Event(
      kind = "disaster",
      date = req.disaster.date,
      content = Some(req.disaster.name.getOrElse("") + " " + req.disaster.disasterTypeId),
      reqId = id
    )

    r :+ disasterEvent

  }

}

// GENERATED case class start
case class Event(
  id: Pk[Int] = NA,
  kind: String = "",
  date: Timestamp = Time.now,
  content: Option[String] = None,
  reqId: Int = 0,
  userId: Option[Int] = None,
  isLegacy: Boolean = false
) extends EventCCGen with Entity[Event]
// GENERATED case class end
{

  def listJson() = {
    val userOpt = userId.map(User.findById(_)).flatten
    Json.obj(
      "kind" -> kind,
      "content" -> content,
      "date" -> date.getTime,
      "user" -> userOpt.map(u => Json.obj(
        "id" -> u.id,
        "name" -> u.name
      )),
      "govUnit" -> userOpt.map(u => Json.obj(
        "id" -> u.govUnit.id,
        "name" -> u.govUnit.name
      ))
    )
  }

}

// GENERATED object start
trait EventGen extends EntityCompanion[Event] {
  val simple = {
    get[Pk[Int]]("event_id") ~
    get[String]("event_kind") ~
    get[Timestamp]("event_date") ~
    get[Option[String]]("event_content") ~
    get[Int]("req_id") ~
    get[Option[Int]]("user_id") ~
    get[Boolean]("event_legacy") map {
      case id~kind~date~content~reqId~userId~isLegacy =>
        Event(id, kind, date, content, reqId, userId, isLegacy)
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

  def listAll(): Seq[Event] = DB.withConnection { implicit c =>
    SQL("select * from events order by event_id").list(simple)
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
            user_id,
            event_legacy
          ) VALUES (
            DEFAULT,
            {kind},
            {date},
            {content},
            {reqId},
            {userId},
            {isLegacy}
          )
        """).on(
          'id -> o.id,
          'kind -> o.kind,
          'date -> o.date,
          'content -> o.content,
          'reqId -> o.reqId,
          'userId -> o.userId,
          'isLegacy -> o.isLegacy
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
            user_id,
            event_legacy
          ) VALUES (
            {id},
            {kind},
            {date},
            {content},
            {reqId},
            {userId},
            {isLegacy}
          )
        """).on(
          'id -> o.id,
          'kind -> o.kind,
          'date -> o.date,
          'content -> o.content,
          'reqId -> o.reqId,
          'userId -> o.userId,
          'isLegacy -> o.isLegacy
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
        user_id={userId},
        event_legacy={isLegacy}
      where event_id={id}
    """).on(
      'id -> o.id,
      'kind -> o.kind,
      'date -> o.date,
      'content -> o.content,
      'reqId -> o.reqId,
      'userId -> o.userId,
      'isLegacy -> o.isLegacy
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

