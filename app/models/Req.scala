package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Req extends ReqGen {
}

// GENERATED case class start
case class Req(
  id: Pk[Int] = NA,
  date: Timestamp = Time.now,
  code: String = "",
  level: Int = 0,
  isValidated: Boolean = false,
  isRejected: Boolean = false,
  authorId: Int = 0,
  assessingAgencyId: Option[Int] = None,
  implementingAgencyId: Option[Int] = None,
  projectType: ProjectType = ProjectType.INFRASTRUCTURE,
  description: String = "",
  amount: BigDecimal = 0,
  location: String = "",
  remarks: Option[String] = None,
  attachments: PGIntList = Nil,
  disasterId: Int = 0
) extends ReqCCGen with Entity[Req]
// GENERATED case class end
{

  def insertJson = Json.obj("id" -> id.get)
  
}

// GENERATED object start
trait ReqGen extends EntityCompanion[Req] {
  val simple = {
    get[Pk[Int]]("req_id") ~
    get[Timestamp]("req_date") ~
    get[String]("req_code") ~
    get[Int]("req_level") ~
    get[Boolean]("req_validated") ~
    get[Boolean]("req_rejected") ~
    get[Int]("author_id") ~
    get[Option[Int]]("assessing_agency_id") ~
    get[Option[Int]]("implementing_agency_id") ~
    get[ProjectType]("req_project_type") ~
    get[String]("req_description") ~
    get[java.math.BigDecimal]("req_amount") ~
    get[String]("req_location") ~
    get[Option[String]]("req_remarks") ~
    get[PGIntList]("req_attachments") ~
    get[Int]("disaster_id") map {
      case id~date~code~level~isValidated~isRejected~authorId~assessingAgencyId~implementingAgencyId~projectType~description~amount~location~remarks~attachments~disasterId =>
        Req(id, date, code, level, isValidated, isRejected, authorId, assessingAgencyId, implementingAgencyId, projectType, description, amount, location, remarks, attachments, disasterId)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from reqs where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Req] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Req] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Req] = findOne("req_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Req] = DB.withConnection { implicit c =>
    SQL("select * from reqs limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Req): Option[Req] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into reqs (
            req_id,
            req_date,
            req_code,
            req_level,
            req_validated,
            req_rejected,
            author_id,
            assessing_agency_id,
            implementing_agency_id,
            req_project_type,
            req_description,
            req_amount,
            req_location,
            req_remarks,
            req_attachments,
            disaster_id
          ) VALUES (
            DEFAULT,
            {date},
            {code},
            {level},
            {isValidated},
            {isRejected},
            {authorId},
            {assessingAgencyId},
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
          'isValidated -> o.isValidated,
          'isRejected -> o.isRejected,
          'authorId -> o.authorId,
          'assessingAgencyId -> o.assessingAgencyId,
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
          insert into reqs (
            req_id,
            req_date,
            req_code,
            req_level,
            req_validated,
            req_rejected,
            author_id,
            assessing_agency_id,
            implementing_agency_id,
            req_project_type,
            req_description,
            req_amount,
            req_location,
            req_remarks,
            req_attachments,
            disaster_id
          ) VALUES (
            {id},
            {date},
            {code},
            {level},
            {isValidated},
            {isRejected},
            {authorId},
            {assessingAgencyId},
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
          'isValidated -> o.isValidated,
          'isRejected -> o.isRejected,
          'authorId -> o.authorId,
          'assessingAgencyId -> o.assessingAgencyId,
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

  def update(o: Req): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update reqs set
        req_date={date},
        req_code={code},
        req_level={level},
        req_validated={isValidated},
        req_rejected={isRejected},
        author_id={authorId},
        assessing_agency_id={assessingAgencyId},
        implementing_agency_id={implementingAgencyId},
        req_project_type={projectType},
        req_description={description},
        req_amount={amount},
        req_location={location},
        req_remarks={remarks},
        req_attachments={attachments},
        disaster_id={disasterId}
      where req_id={id}
    """).on(
      'id -> o.id,
      'date -> o.date,
      'code -> o.code,
      'level -> o.level,
      'isValidated -> o.isValidated,
      'isRejected -> o.isRejected,
      'authorId -> o.authorId,
      'assessingAgencyId -> o.assessingAgencyId,
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
    SQL("delete from reqs where req_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait ReqCCGen {
  val companion = Req
}
// GENERATED object end

