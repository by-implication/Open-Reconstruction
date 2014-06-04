package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Req extends ReqGen {

  private def byProjectType = DB.withConnection { implicit c =>
    SQL("""
      SELECT project_type_name, COUNT(*), SUM(req_amount)
      FROM reqs NATURAL JOIN project_types
      GROUP BY project_type_name;
    """).list(
      get[String]("project_type_name") ~
      get[Long]("count") ~
      get[Option[java.math.BigDecimal]]("sum") map { case name~count~amount =>
        Json.obj(
          "name" -> name,
          "count" -> count,
          "amount" -> amount.getOrElse(0).toString
        )
      }
    )
  }

  private def byNamedDisaster = DB.withConnection { implicit c =>
    SQL("""
      SELECT req_disaster_name, COUNT(*), SUM(req_amount)
      FROM reqs GROUP BY req_disaster_name
    """).list(
      get[String]("req_disaster_name") ~
      get[Long]("count") ~
      get[Option[java.math.BigDecimal]]("sum") map { case name~count~amount =>
        Json.obj(
          "name" -> name,
          "count" -> count,
          "amount" -> amount.getOrElse(0).toString
        )
      }
    )
  }

  def createSampleRequests = DB.withConnection { implicit c =>

    play.Logger.info("* Inferring requests from entries.")

    SQL("""
      INSERT INTO reqs (req_description, project_type_id, req_scope, req_disaster_name, req_amount, author_id, req_location, req_disaster_date)
      SELECT group_id,
        CASE 
          WHEN array_agg(DISTINCT project_type_id) = ARRAY[NULL]::INT[] THEN 
            (SELECT project_type_id FROM project_types WHERE project_type_name = 'Others')
          WHEN count(DISTINCT project_type) = 1 THEN (array_agg(project_type_id))[1]
          ELSE (SELECT project_type_id from project_types WHERE project_type_name = 'Mixed')
        END AS project_type_id,
        CASE 
          WHEN count(DISTINCT initcap(scope)) = 1 THEN (array_agg(initcap(scope)))[1]::project_scope
          ELSE 'Others'
         END as scope,
        disaster_name, 
        SUM( CASE
          WHEN oparr_bohol.amount = '-' THEN 0
          ELSE oparr_bohol.amount::numeric(12,2)
          END
        ) as amount,
        1 as author_id, group_id as loc, NOW() 
      FROM oparr_bohol
      LEFT JOIN project_types on initcap(project_type_name) = initcap(project_type)
      GROUP BY group_id, disaster_name
    """).execute()
    play.Logger.info("*   OPARR-Bohol requests created.")

    SQL("""
      INSERT INTO reqs (req_description, project_type_id, req_amount,
        req_scope, author_id, req_location, disaster_type_id, 
        req_disaster_date, req_disaster_name, req_remarks
        )
      SELECT project_description, 
        1 as project_type_id,
        coalesce(project_abc*1000, 0) as amount,
        'Others'::project_scope as scope,
        1 as author_id,
        psgc, 
        CASE 
          WHEN lower(disaster) ilike '%earthquake%' THEN 1
          WHEN lower(disaster) ilike '%typhoon%' THEN 2
          ELSE 7
          END as disaster_type,
        now() as disaster_date,
        disaster,
        project_id
      FROM dpwh_eplc
    """).execute()
    play.Logger.info("*   DPWH EPLC Requests created.")
  }

  private def byDisasterType = DB.withConnection { implicit c =>
    SQL("""
      SELECT
        EXTRACT(YEAR FROM req_date) AS year,
        EXTRACT(MONTH FROM req_date) AS month,
        disaster_type_name,
        COUNT(req_id)
      FROM reqs NATURAL JOIN disaster_types
      GROUP BY disaster_type_name, year, month
      ORDER BY disaster_type_name, year, month
    """).list(
      get[Double]("year") ~
      get[Double]("month") ~
      get[String]("disaster_type_name") ~
      get[Long]("count") map { case _year~_month~disasterType~count =>
        val year = _year.toInt
        val month = _month.toInt
        Json.obj(
          "yearMonth" -> (year + "-" + (if (month < 10) "0" + month else month)),
          "disasterType" -> disasterType,
          "count" -> count
        )
      }
    )
  }

  private def byLevel(level: Int) = DB.withConnection { implicit c =>
    val r = SQL("SELECT COUNT(*) AS count, SUM(req_amount) AS amount FROM reqs" +
      (if (level != 0) " WHERE req_level = {level} AND NOT req_rejected" else "")
    ).on('level -> level).list(
      get[Long]("count") ~
      get[Option[java.math.BigDecimal]]("amount") map { case count~amount =>
        Json.obj(
          "amount" -> amount.getOrElse(0).toString,
          "count" -> count
        )
      }
    )
    r(0)
  }

  private def mostCommonProjectType = DB.withConnection { implicit c =>
    val list = SQL("SELECT COUNT(*) FROM reqs GROUP BY project_type_id ORDER BY COUNT(*) DESC")
    .list(scalar[Long])
    list(0)
  }

  private def mostCommonDisasterType = DB.withConnection { implicit c =>
    val list = SQL("SELECT COUNT(*) FROM reqs GROUP BY disaster_type_id ORDER BY COUNT(*) DESC")
    .list(scalar[Long])
    list(0)
  }

  private def byMonth = DB.withConnection { implicit c =>
    SQL("""
      SELECT
        COUNT(req_id) as count,
        SUM(req_amount) as amount,
        EXTRACT(MONTH FROM req_date) AS month,
        EXTRACT(YEAR FROM req_date) AS year
      FROM reqs
      GROUP BY year, month
      ORDER BY year, month
    """).list(
      get[Long]("count") ~
      get[java.math.BigDecimal]("amount") ~
      get[Double]("month") ~
      get[Double]("year") map { case count~amount~_month~_year =>
        val year = _year.toInt
        val month = _month.toInt
        Json.obj(
          "yearMonth" -> (year + "-" + (if (month < 10) "0" + month else month)),
          "count" -> count,
          "amount" -> amount.toString
        )
      }
    )
  }

  def dashboardData = {
    Json.obj(
      "mostCommonDisasterType" -> mostCommonDisasterType,
      "mostCommonProjectType" -> mostCommonProjectType,
      "byLevel" -> (0 to 5).map(byLevel),
      "byMonth" -> Json.toJson(byMonth),
      "byDisasterType" -> byDisasterType,
      "byProjectType" -> byProjectType,
      "byNamedDisaster" -> byNamedDisaster
    )
  }

  private def getSqlParams(tab: String, projectTypeId: Option[Int])(implicit user: User) = {

    var table = "reqs"
    var whereClauses = List.empty[String]
    def addWhereClause(clause: String) = whereClauses = whereClauses :+ clause

    projectTypeId.map(_ => addWhereClause("project_type_id = {projectTypeId}"))

    tab match {
      case "all" => {}
      case "signoff" => {
        if(!user.isAnon){
          val targetRequestLevelOpt: Option[Int] = user.govUnit.role.name match {
            case "OCD" => Some(2)
            case "OP" => Some(3)
            case "DBM" => Some(4)
            case _ => None
          }
          addWhereClause("(" +
            "(req_level = 1 AND assessing_agency_id = " + user.govUnitId + ")" +
            targetRequestLevelOpt.map(t => " OR (req_level = " + t + ")")
            .getOrElse("") +
          ")")
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

  def projects(id: Int): Seq[Project] = DB.withConnection { implicit c =>
    SQL("SELECT * FROM projects WHERE req_id = {id}").on('id -> id).list(Project.simple)
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
  disasterName: Option[String] = None,
  saroNo: Option[String] = None
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

  lazy val isSaroAssigned: Boolean = saroNo.isDefined

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

  def projects: Seq[Project] = Req.projects(id)

  def insertJson = Json.obj("id" -> id.get)

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
    "isSaroAssigned" -> isSaroAssigned,
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
    get[Option[String]]("req_disaster_name") ~
    get[Option[String]]("saro_no") map {
      case id~description~projectTypeId~amount~scope~date~level~isValidated~isRejected~authorId~assessingAgencyId~implementingAgencyId~location~remarks~attachmentIds~disasterTypeId~disasterDate~disasterName~saroNo =>
        Req(id, description, projectTypeId, amount, scope, date, level, isValidated, isRejected, authorId, assessingAgencyId, implementingAgencyId, location, remarks, attachmentIds, disasterTypeId, disasterDate, disasterName, saroNo)
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
            req_disaster_name,
            saro_no
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
            {disasterName},
            {saroNo}
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
          'disasterName -> o.disasterName,
          'saroNo -> o.saroNo
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
            req_disaster_name,
            saro_no
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
            {disasterName},
            {saroNo}
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
          'disasterName -> o.disasterName,
          'saroNo -> o.saroNo
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
        req_disaster_name={disasterName},
        saro_no={saroNo}
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
      'disasterName -> o.disasterName,
      'saroNo -> o.saroNo
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

