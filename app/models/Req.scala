package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Req extends ReqGen {

  private def getSqlParams(tab: String, projectTypeId: Option[Int])(implicit user: User) = {

    var table = "reqs"
    var whereClauses = List.empty[String]
    def addWhereClause(clause: String) = whereClauses = whereClauses :+ clause

    projectTypeId.map(_ => addWhereClause("project_type_id = {projectTypeId}"))

    tab match {
      case "all" => {}
      case "signoff" => {
        if(!user.isAnon){
          table = """
            reqs LEFT JOIN users ON author_id = user_id
            NATURAL LEFT JOIN gov_units
            NATURAL LEFT JOIN roles
          """
          addWhereClause("""(
            (req_level = 1 AND assessing_agency_id = """ + user.govUnitId + """) OR
            (req_level = 2 AND role_name = 'OCD') OR
            (req_level = 3 AND role_name = 'OP') OR
            (req_level = 4 AND role_name = 'DBM')
          )""")
        }
      }
      case "assessor" => {
        addWhereClause("req_level = 0")
        addWhereClause("assessing_agency_id IS NULL")
      }
      case "mine" => {
        if (!user.isAnon){
          table = "reqs LEFT JOIN users ON author_id = user_id"
          addWhereClause("gov_unit_id = " + user.govUnit.id.get)
        }
      }
      case "approval" => {
        addWhereClause("req_level <= 4")
      }
      case "implementation" => {
        addWhereClause("req_level > 4")
      }
    }

    (table, whereClauses)

  }

  def indexCount(tab: String, projectTypeId: Option[Int])(implicit user: User): Long = {
    val (table, whereClauses) = getSqlParams(tab, projectTypeId)
    DB.withConnection { implicit c =>
      SQL("SELECT COUNT(*) FROM " + table + {
        if (!whereClauses.isEmpty) " WHERE " + whereClauses.mkString(" AND ")
        else ""
      })
      .on(
        'projectTypeId -> projectTypeId
      ).as(scalar[Long].single)
    }
  }

  def indexList(tab: String, offset: Int, limit: Int, projectTypeId: Option[Int])(implicit user: User): Seq[Req] = {
    val (table, whereClauses) = getSqlParams(tab, projectTypeId)
    DB.withConnection { implicit c =>
      SQL("SELECT * FROM " + table + {
        if (!whereClauses.isEmpty) " WHERE " + whereClauses.mkString(" AND ")
        else ""
      } + """
        ORDER BY req_date DESC
        OFFSET {offset}
        LIMIT {limit}
      """).on(
        'projectTypeId -> projectTypeId,
        'offset -> offset,
        'limit -> limit
      ).list(simple)
    }
  }

  def authoredBy(id: Int) = DB.withConnection { implicit c =>
    SQL("SELECT * FROM reqs WHERE author_id = {id} ORDER BY req_date DESC").on('id -> id).list(simple)
  }

}

// GENERATED case class start
case class Req(
  id: Pk[Int] = NA,
  description: String = "",
  projectTypeId: Int = 0,
  amount: BigDecimal = 0,
  scope: ProjectScope = ProjectScope.REPAIR,
  date: Timestamp = Time.now,
  level: Int = 0,
  isValidated: Boolean = false,
  isRejected: Boolean = false,
  authorId: Int = 0,
  assessingAgencyId: Option[Int] = None,
  implementingAgencyId: Option[Int] = None,
  location: String = "",
  remarks: Option[String] = None,
  attachmentIds: PGIntList = Nil,
  disasterTypeId: Int = 1,
  disasterDate: Timestamp = Time.now,
  disasterName: Option[String] = None
) extends ReqCCGen with Entity[Req]
// GENERATED case class end
{

  lazy val projectType = ProjectType.findById(projectTypeId).get
  lazy val disasterType = DisasterType.findById(disasterTypeId).get

  def assignAssessor(id: Int): Req = {
    if(id == 0){
      copy(assessingAgencyId = None, level = 0)
    } else {
      copy(assessingAgencyId = Some(id), level = 1)
    }
  }

  lazy val assessingAgency = assessingAgencyId.map(GovUnit.findById(_).get)
  lazy val implementingAgency = implementingAgencyId.map(GovUnit.findById(_).get)

  lazy val currentCheckpoint: Option[Checkpoint] = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM checkpoints
      WHERE req_id = {reqId}
      ORDER BY checkpoint_date_received DESC LIMIT 1
    """).on('reqId -> id).singleOpt(Checkpoint.simple)
  }

  def age(level: Int = level): Option[Long] = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM checkpoints
      WHERE req_id = {reqId}
      ORDER BY checkpoint_level DESC
    """).on('reqId -> id).list(Checkpoint.simple).headOption.map(_.duration)
  }

  def addToAttachments(attachmentId: Int): Boolean = DB.withConnection { implicit c =>
    SQL("""
      UPDATE reqs
      SET req_attachment_ids = array_append(req_attachment_ids, {attachmentId})
      WHERE req_id = {reqId}
    """)
    .on(
      'reqId -> id,
      'attachmentId -> attachmentId
    ).executeUpdate() > 0
  }

  lazy val attachments: Seq[(Attachment, User)] = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM attachments LEFT JOIN users ON uploader_id = user_id
      WHERE attachment_id = ANY({attachmentIds})
    """)
    .on('attachmentIds -> attachmentIds).list(Attachment.simple ~ User.simple map(flatten))
  }

  lazy val author = User.findById(authorId).get

  def insertJson = Json.obj("id" -> id.get)

  def dashboardJson = Json.obj(
    "id" -> id.get,
    "date" -> date,
    "level" -> level,
    "amount" -> amount,
    "projectTypeId" -> projectTypeId,
    "disasterTypeId" -> disasterTypeId
  )

  def indexJson(implicit user: User) = Json.obj(
    "id" -> id.get,
    "description" -> description,
    "projectTypeId" -> projectTypeId,
    "age" -> age(),
    "level" -> level,
    "amount" -> amount,
    "author" -> Json.obj(
      "id" -> authorId,
      "govUnit" -> Json.obj(
        "name" -> author.govUnit.name,
        "id" -> author.govUnit.id.get
      )
    ),
    "assessingAgencyId" -> assessingAgencyId,
    "canSignoff" -> user.canSignoff(this),
    "isRejected" -> isRejected
  )

  def viewJson = Json.obj(
    "id" -> id.get,
    "description" -> description,
    "projectType" -> projectType.name,
    "amount" -> amount,
    "scope" -> scope.toString,
    "date" -> date,
    "level" -> level,
    "isValidated" -> isValidated,
    "isRejected" -> isRejected,
    "authorId" -> authorId,
    "assessingAgencyId" -> assessingAgencyId,
    "implementingAgencyId" -> implementingAgencyId,
    "location" -> location,
    "remarks" -> (remarks.getOrElse(""):String),
    "disaster" -> Json.obj(
      "typeId" -> disasterTypeId,
      "date" -> disasterDate,
      "name" -> (disasterName.getOrElse(""):String)
    )
  )
  
}

// GENERATED object start
trait ReqGen extends EntityCompanion[Req] {
  val simple = {
    get[Pk[Int]]("req_id") ~
    get[String]("req_description") ~
    get[Int]("project_type_id") ~
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
    get[PGIntList]("req_attachment_ids") ~
    get[Int]("disaster_type_id") ~
    get[Timestamp]("req_disaster_date") ~
    get[Option[String]]("req_disaster_name") map {
      case id~description~projectTypeId~amount~scope~date~level~isValidated~isRejected~authorId~assessingAgencyId~implementingAgencyId~location~remarks~attachmentIds~disasterTypeId~disasterDate~disasterName =>
        Req(id, description, projectTypeId, amount, scope, date, level, isValidated, isRejected, authorId, assessingAgencyId, implementingAgencyId, location, remarks, attachmentIds, disasterTypeId, disasterDate, disasterName)
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

  def listAll(): Seq[Req] = DB.withConnection { implicit c =>
    SQL("select * from reqs order by req_id").list(simple)
  }

  def insert(o: Req): Option[Req] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into reqs (
            req_id,
            req_description,
            project_type_id,
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
            req_attachment_ids,
            disaster_type_id,
            req_disaster_date,
            req_disaster_name
          ) VALUES (
            DEFAULT,
            {description},
            {projectTypeId},
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
            {attachmentIds},
            {disasterTypeId},
            {disasterDate},
            {disasterName}
          )
        """).on(
          'id -> o.id,
          'description -> o.description,
          'projectTypeId -> o.projectTypeId,
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
          'attachmentIds -> o.attachmentIds,
          'disasterTypeId -> o.disasterTypeId,
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
            project_type_id,
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
            req_attachment_ids,
            disaster_type_id,
            req_disaster_date,
            req_disaster_name
          ) VALUES (
            {id},
            {description},
            {projectTypeId},
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
            {attachmentIds},
            {disasterTypeId},
            {disasterDate},
            {disasterName}
          )
        """).on(
          'id -> o.id,
          'description -> o.description,
          'projectTypeId -> o.projectTypeId,
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
          'attachmentIds -> o.attachmentIds,
          'disasterTypeId -> o.disasterTypeId,
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
        project_type_id={projectTypeId},
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
        req_attachment_ids={attachmentIds},
        disaster_type_id={disasterTypeId},
        req_disaster_date={disasterDate},
        req_disaster_name={disasterName}
      where req_id={id}
    """).on(
      'id -> o.id,
      'description -> o.description,
      'projectTypeId -> o.projectTypeId,
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
      'attachmentIds -> o.attachmentIds,
      'disasterTypeId -> o.disasterTypeId,
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

