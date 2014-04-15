package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.Play.current
import recon.support._

object Request extends RequestGen {
}

// GENERATED case class start
case class Request(
  id: Pk[Int] = NA,
  date: Timestamp = Time.now,
  code: String = "",
  level: Int = 0,
  isRejected: Boolean = false,
  authorId: Int = 0,
  implementingAgencyId: Int = 0,
  projectType: ProjectType = ProjectType.INFRASTRUCTURE,
  description: String = "",
  amount: BigDecimal = 0,
  location: String = "",
  remarks: Option[String] = None,
  attachments: PGIntList = Nil,
  disasterId: Int = 0
) extends RequestCCGen with Entity[Request]
// GENERATED case class end

// GENERATED object start
trait RequestGen extends EntityCompanion[Request] {
  val simple = {
    get[Pk[Int]]("request_id") ~
    get[Timestamp]("request_date") ~
    get[String]("request_code") ~
    get[Int]("request_level") ~
    get[Boolean]("request_rejected") ~
    get[Int]("author_id") ~
    get[Int]("implementing_agency_id") ~
    get[ProjectType]("request_project_type") ~
    get[String]("request_description") ~
    get[java.math.BigDecimal]("request_amount") ~
    get[String]("request_location") ~
    get[Option[String]]("request_remarks") ~
    get[PGIntList]("request_attachments") ~
    get[Int]("disaster_id") map {
      case id~date~code~level~isRejected~authorId~implementingAgencyId~projectType~description~amount~location~remarks~attachments~disasterId =>
        Request(id, date, code, level, isRejected, authorId, implementingAgencyId, projectType, description, amount, location, remarks, attachments, disasterId)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from requests where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Request] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Request] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Request] = findOne("request_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Request] = DB.withConnection { implicit c =>
    SQL("select * from requests limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Request): Option[Request] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into requests (
            request_id,
            request_date,
            request_code,
            request_level,
            request_rejected,
            author_id,
            implementing_agency_id,
            request_project_type,
            request_description,
            request_amount,
            request_location,
            request_remarks,
            request_attachments,
            disaster_id
          ) VALUES (
            DEFAULT,
            {date},
            {code},
            {level},
            {isRejected},
            {authorId},
            {implementingAgencyId},
            {projectType},
            {description},
            {amount},
            {location},
            {remarks},
            {attachments},
            {disasterId}
          )
        """).on(
          'id -> o.id,
          'date -> o.date,
          'code -> o.code,
          'level -> o.level,
          'isRejected -> o.isRejected,
          'authorId -> o.authorId,
          'implementingAgencyId -> o.implementingAgencyId,
          'projectType -> o.projectType,
          'description -> o.description,
          'amount -> o.amount.bigDecimal,
          'location -> o.location,
          'remarks -> o.remarks,
          'attachments -> o.attachments,
          'disasterId -> o.disasterId
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into requests (
            request_id,
            request_date,
            request_code,
            request_level,
            request_rejected,
            author_id,
            implementing_agency_id,
            request_project_type,
            request_description,
            request_amount,
            request_location,
            request_remarks,
            request_attachments,
            disaster_id
          ) VALUES (
            {id},
            {date},
            {code},
            {level},
            {isRejected},
            {authorId},
            {implementingAgencyId},
            {projectType},
            {description},
            {amount},
            {location},
            {remarks},
            {attachments},
            {disasterId}
          )
        """).on(
          'id -> o.id,
          'date -> o.date,
          'code -> o.code,
          'level -> o.level,
          'isRejected -> o.isRejected,
          'authorId -> o.authorId,
          'implementingAgencyId -> o.implementingAgencyId,
          'projectType -> o.projectType,
          'description -> o.description,
          'amount -> o.amount.bigDecimal,
          'location -> o.location,
          'remarks -> o.remarks,
          'attachments -> o.attachments,
          'disasterId -> o.disasterId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Request): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update requests set
        request_date={date},
        request_code={code},
        request_level={level},
        request_rejected={isRejected},
        author_id={authorId},
        implementing_agency_id={implementingAgencyId},
        request_project_type={projectType},
        request_description={description},
        request_amount={amount},
        request_location={location},
        request_remarks={remarks},
        request_attachments={attachments},
        disaster_id={disasterId}
      where request_id={id}
    """).on(
      'id -> o.id,
      'date -> o.date,
      'code -> o.code,
      'level -> o.level,
      'isRejected -> o.isRejected,
      'authorId -> o.authorId,
      'implementingAgencyId -> o.implementingAgencyId,
      'projectType -> o.projectType,
      'description -> o.description,
      'amount -> o.amount.bigDecimal,
      'location -> o.location,
      'remarks -> o.remarks,
      'attachments -> o.attachments,
      'disasterId -> o.disasterId
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from requests where request_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait RequestCCGen {
  val companion = Request
}
// GENERATED object end

