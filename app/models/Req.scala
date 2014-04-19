package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Req extends ReqGen {

  def indexList() = DB.withConnection { implicit c =>
    SQL("SELECT * FROM reqs ORDER BY req_date DESC").list(simple)
  }

}

// GENERATED case class start
case class Req(
  id: Pk[Int] = NA,
  description: String = "",
  projectType: ProjectType = ProjectType.BRIDGES,
  amount: BigDecimal = 0,
  scope: ProjectScope = ProjectScope.REPAIR_AND_REHABILITATION,
  date: Timestamp = Time.now,
  level: Int = 0,
  isValidated: Boolean = false,
  isRejected: Boolean = false,
  authorId: Int = 0,
  assessingAgencyId: Option[Int] = None,
  implementingAgencyId: Option[Int] = None,
  location: String = "",
  remarks: Option[String] = None,
  attachments: PGIntList = Nil,
  disasterType: DisasterType = DisasterType.TYPHOON,
  disasterDate: Timestamp = Time.now,
  disasterName: Option[String] = None
) extends ReqCCGen with Entity[Req]
// GENERATED case class end
{

  lazy val author = User.findById(authorId).get

  def insertJson = Json.obj("id" -> id.get)

  def indexJson = Json.obj(
    "id" -> id.get,
    "description" -> description,
    "projectType" -> projectType.name,
    "amount" -> amount,
    "author" -> Map("agency" -> author.agency.name)
  )
  
}

// GENERATED object start
trait ReqGen extends EntityCompanion[Req] {
  val simple = {
    get[Pk[Int]]("req_id") ~
    get[String]("req_description") ~
    get[ProjectType]("req_project_type") ~
    get[java.math.BigDecimal]("req_amount") ~
    get[ProjectScope]("req_scope") ~
    get[Timestamp]("req_date") ~
    get[Int]("req_level") ~
    get[Boolean]("req_validated") ~
    get[Boolean]("req_rejected") ~
    get[Int]("author_id") ~
    get[Option[Int]]("assessing_agency_id") ~
    get[Option[Int]]("implementing_agency_id") ~
    get[String]("req_location") ~
    get[Option[String]]("req_remarks") ~
    get[PGIntList]("req_attachments") ~
    get[DisasterType]("req_disaster_type") ~
    get[Timestamp]("req_disaster_date") ~
    get[Option[String]]("req_disaster_name") map {
      case id~description~projectType~amount~scope~date~level~isValidated~isRejected~authorId~assessingAgencyId~implementingAgencyId~location~remarks~attachments~disasterType~disasterDate~disasterName =>
        Req(id, description, projectType, amount, scope, date, level, isValidated, isRejected, authorId, assessingAgencyId, implementingAgencyId, location, remarks, attachments, disasterType, disasterDate, disasterName)
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
            req_description,
            req_project_type,
            req_amount,
            req_scope,
            req_date,
            req_level,
            req_validated,
            req_rejected,
            author_id,
            assessing_agency_id,
            implementing_agency_id,
            req_location,
            req_remarks,
            req_attachments,
            req_disaster_type,
            req_disaster_date,
            req_disaster_name
          ) VALUES (
            DEFAULT,
            {description},
            {projectType},
            {amount},
            {scope},
            {date},
            {level},
            {isValidated},
            {isRejected},
            {authorId},
            {assessingAgencyId},
            {implementingAgencyId},
            {location},
            {remarks},
            {attachments},
            {disasterType},
            {disasterDate},
            {disasterName}
          )
        """).on(
          'id -> o.id,
          'description -> o.description,
          'projectType -> o.projectType,
          'amount -> o.amount.bigDecimal,
          'scope -> o.scope,
          'date -> o.date,
          'level -> o.level,
          'isValidated -> o.isValidated,
          'isRejected -> o.isRejected,
          'authorId -> o.authorId,
          'assessingAgencyId -> o.assessingAgencyId,
          'implementingAgencyId -> o.implementingAgencyId,
          'location -> o.location,
          'remarks -> o.remarks,
          'attachments -> o.attachments,
          'disasterType -> o.disasterType,
          'disasterDate -> o.disasterDate,
          'disasterName -> o.disasterName
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into reqs (
            req_id,
            req_description,
            req_project_type,
            req_amount,
            req_scope,
            req_date,
            req_level,
            req_validated,
            req_rejected,
            author_id,
            assessing_agency_id,
            implementing_agency_id,
            req_location,
            req_remarks,
            req_attachments,
            req_disaster_type,
            req_disaster_date,
            req_disaster_name
          ) VALUES (
            {id},
            {description},
            {projectType},
            {amount},
            {scope},
            {date},
            {level},
            {isValidated},
            {isRejected},
            {authorId},
            {assessingAgencyId},
            {implementingAgencyId},
            {location},
            {remarks},
            {attachments},
            {disasterType},
            {disasterDate},
            {disasterName}
          )
        """).on(
          'id -> o.id,
          'description -> o.description,
          'projectType -> o.projectType,
          'amount -> o.amount.bigDecimal,
          'scope -> o.scope,
          'date -> o.date,
          'level -> o.level,
          'isValidated -> o.isValidated,
          'isRejected -> o.isRejected,
          'authorId -> o.authorId,
          'assessingAgencyId -> o.assessingAgencyId,
          'implementingAgencyId -> o.implementingAgencyId,
          'location -> o.location,
          'remarks -> o.remarks,
          'attachments -> o.attachments,
          'disasterType -> o.disasterType,
          'disasterDate -> o.disasterDate,
          'disasterName -> o.disasterName
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Req): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update reqs set
        req_description={description},
        req_project_type={projectType},
        req_amount={amount},
        req_scope={scope},
        req_date={date},
        req_level={level},
        req_validated={isValidated},
        req_rejected={isRejected},
        author_id={authorId},
        assessing_agency_id={assessingAgencyId},
        implementing_agency_id={implementingAgencyId},
        req_location={location},
        req_remarks={remarks},
        req_attachments={attachments},
        req_disaster_type={disasterType},
        req_disaster_date={disasterDate},
        req_disaster_name={disasterName}
      where req_id={id}
    """).on(
      'id -> o.id,
      'description -> o.description,
      'projectType -> o.projectType,
      'amount -> o.amount.bigDecimal,
      'scope -> o.scope,
      'date -> o.date,
      'level -> o.level,
      'isValidated -> o.isValidated,
      'isRejected -> o.isRejected,
      'authorId -> o.authorId,
      'assessingAgencyId -> o.assessingAgencyId,
      'implementingAgencyId -> o.implementingAgencyId,
      'location -> o.location,
      'remarks -> o.remarks,
      'attachments -> o.attachments,
      'disasterType -> o.disasterType,
      'disasterDate -> o.disasterDate,
      'disasterName -> o.disasterName
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

