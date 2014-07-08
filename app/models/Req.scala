package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._
import scala.language.existentials

object Req extends ReqGen {

  lazy val levels = List(
    "RECEIVED",
    "ASSESSOR_ASSIGNMENT",
    "ASSESSOR_SIGNOFF",
    "OCD_SIGNOFF",
    "OP_SIGNOFF",
    "SARO_ASSIGNMENT",
    "EXECUTOR_ASSIGNMENT",
    "IMPLEMENTATION"
  )

  def PAGE_LIMIT = 20

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
      SELECT disaster_name, COUNT(*), SUM(req_amount)
      FROM reqs NATURAL JOIN disasters GROUP BY disaster_name
    """).list(
      get[Option[String]]("disaster_name") ~
      get[Long]("count") ~
      get[Option[java.math.BigDecimal]]("sum") map { case nameOpt~count~amount =>
        val name: String = nameOpt.getOrElse("N/A")
        Json.obj(
          "name" -> name,
          "count" -> count,
          "amount" -> amount.getOrElse(0).toString
        )
      }
    )
  }

  private def byDisasterType = DB.withConnection { implicit c =>
    SQL("""
      SELECT
        EXTRACT(YEAR FROM req_date) AS year,
        EXTRACT(MONTH FROM req_date) AS month,
        disaster_type_name,
        COUNT(req_id)
      FROM reqs NATURAL JOIN disasters NATURAL JOIN disaster_types
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
    val list = SQL("""
      SELECT COUNT(*) FROM reqs NATURAL JOIN disasters
      GROUP BY disaster_type_id
      ORDER BY COUNT(*) DESC
    """)
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

  def vizData = {
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

  case class VarMap(vars: (Any, anorm.ParameterValue[_])*){
    var list: Seq[(Any, anorm.ParameterValue[_])] = vars.toSeq
    def add(vars: (Any, anorm.ParameterValue[_])*) = list = list ++ vars.toSeq
  }

  private def getSqlParams(tab: String, projectTypeId: Option[Int], psgc: PGLTree, disasterId: Option[Int])(implicit user: User) = {

    var table = "reqs"
    var whereClauses = Seq.empty[String]
    var varMap = VarMap('projectTypeId -> projectTypeId, 'psgc -> psgc)
    def addWhereClause(clause: String) = whereClauses = whereClauses :+ clause

    disasterId.map { id =>
      addWhereClause("disaster_id = {disasterId}")
      varMap.add('disasterId -> id)
    }

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
      case "executor" => {
        addWhereClause("req_level = 5")
        addWhereClause("implementing_agency_id IS NOT NULL")
        addWhereClause("executing_agency_id IS NULL")
      }
      case "mine" => {
        if (!user.isAnon){
          addWhereClause("gov_unit_id = " + user.govUnit.id)
        }
      }
      case "approval" => {
        addWhereClause("req_level <= 4")
      }
      case "implementation" => {
        addWhereClause("req_level > 4")
      }
    }

    if(!psgc.list.isEmpty){
      table = """
        reqs LEFT JOIN lgus ON lgus.lgu_id = gov_unit_id
      """
      addWhereClause("lgu_psgc <@ {psgc}")
    }

    (table, whereClauses, varMap)

  }

  def indexCount(tab: String, projectTypeId: Option[Int], psgc: PGLTree, disasterId: Int)(implicit user: User): Long = {
    val (table, whereClauses, varMap) = getSqlParams(tab, projectTypeId, psgc, if (disasterId == 0) None else Some(disasterId) )
    DB.withConnection { implicit c =>
      SQL("SELECT COUNT(*) FROM " + table + {
        if (!whereClauses.isEmpty) " WHERE " + whereClauses.mkString(" AND ")
        else ""
      })
      .on(varMap.list:_*).as(scalar[Long].single)
    }
  }

  def indexList(tab: String, offset: Int, limit: Int, projectTypeId: Option[Int], psgc: PGLTree, sort: String, sortDir: String, disasterId: Int)(implicit user: User): Seq[Req] = {
    var (table, whereClauses, varMap) = getSqlParams(tab, projectTypeId, psgc, if (disasterId == 0) None else Some(disasterId) )
    val sortColumn = (sort match {
      case "id" => "req_id"
      case "status" => "req_level"
      case "amount" => "req_amount"
      case _ => "req_date"
    })

    val sortColumnDir = (sortDir match {
      case "asc" => "ASC"
      case _ => "DESC"
    })

    varMap.add('offset -> offset, 'limit -> limit)

    DB.withConnection { implicit c =>
      SQL("SELECT * FROM " + table + {
        if (!whereClauses.isEmpty) " WHERE " + whereClauses.mkString(" AND ")
        else ""
      } + """
        ORDER BY """ + sortColumn  + " " + sortColumnDir + """
        OFFSET {offset}
        LIMIT {limit}
      """).on(varMap.list:_*).list(simple)
    }
  }

  def authoredBy(id: Int, offset: Int, limit: Int, sort: String, sortDir: String): (Seq[Req], Long) = DB.withConnection { implicit c =>
    
    val sortColumn = (sort match {
      case "id" => "req_id"
      case "status" => "req_level"
      case "amount" => "req_amount"
      case _ => "req_date"
    })

    val sortColumnDir = (sortDir match {
      case "asc" => "ASC"
      case _ => "DESC"
    })

    val sqlResult = SQL("""
      SELECT *, count(*) OVER() FROM reqs WHERE author_id = {id} 
      ORDER BY """ + sortColumn + " " + sortColumnDir + """
      OFFSET {offset}
      LIMIT {limit}
    """).on(
      'id -> id,
      'offset -> offset,
      'limit -> limit
    )

    val parsed = sqlResult.list(simple)
    val counted:Long = sqlResult.list(get[Long]("count")).headOption.getOrElse(0)

    (parsed, counted)
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
  date: Timestamp = Time.now,
  level: Int = 0,
  isRejected: Boolean = false,
  authorId: Int = 0,
  assessingAgencyId: Option[Int] = None,
  implementingAgencyId: Option[Int] = None,
  location: String = "",
  attachmentIds: PGIntList = Nil,
  saroNo: Option[String] = None,
  disasterId: Int = 0,
  govUnitId: Int = 0,
  isLegacy: Boolean = false,
  executingAgencyId: Option[Int] = None
) extends ReqCCGen with Entity[Req]
// GENERATED case class end
{

  lazy val disaster = Disaster.findById(disasterId).get
  lazy val projectType = ProjectType.findById(projectTypeId).get

  def assignAssessor(id: Int): Req = {
    if(id == 0){
      copy(assessingAgencyId = None, level = 0)
    } else {
      copy(assessingAgencyId = Some(id), level = 1)
    }
  }

  lazy val assessingAgency = assessingAgencyId.map(GovUnit.findById(_).get)
  lazy val implementingAgency = implementingAgencyId.map(GovUnit.findById(_).get)
  lazy val executingAgency = executingAgencyId.map(GovUnit.findById(_).get)

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
  lazy val govUnit = GovUnit.findById(govUnitId).get

  def projects: Seq[Project] = Req.projects(id)

  def indexJson(implicit user: User) = Json.obj(
    "id" -> id,
    "description" -> description,
    "projectTypeId" -> projectTypeId,
    "age" -> age(),
    "level" -> level,
    "amount" -> amount,
    "author" -> Json.obj(
      "id" -> authorId,
      "govUnit" -> Json.obj(
        "name" -> govUnit.name,
        "id" -> govUnit.id
      )
    ),
    "assessingAgencyId" -> assessingAgencyId,
    "implementingAgency" -> (implementingAgency match {
      case Some(agency) => Json.obj(
        "id" -> agency.id,
        "name" -> (agency.acronym.getOrElse(agency.name):String)
      )
      case None => JsNull
    }),
    "canSignoff" -> user.canSignoff(this),
    "isRejected" -> isRejected
  )

  def viewJson = Json.obj(
    "id" -> id,
    "description" -> description,
    "projectType" -> projectType.name,
    "amount" -> amount,
    "date" -> date,
    "now" -> Time.now.getTime,
    "level" -> level,
    "isRejected" -> isRejected,
    "isSaroAssigned" -> isSaroAssigned,
    "assessingAgencyId" -> assessingAgencyId,
    "implementingAgencyId" -> implementingAgencyId,
    "executingAgencyId" -> executingAgencyId,
    "location" -> location,
    "disaster" -> disaster.toJson,
    "isLegacy" -> isLegacy
  )
  
}

// GENERATED object start
trait ReqGen extends EntityCompanion[Req] {
  val simple = {
    get[Pk[Int]]("req_id") ~
    get[String]("req_description") ~
    get[Int]("project_type_id") ~
    get[java.math.BigDecimal]("req_amount") ~
    get[Timestamp]("req_date") ~
    get[Int]("req_level") ~
    get[Boolean]("req_rejected") ~
    get[Int]("author_id") ~
    get[Option[Int]]("assessing_agency_id") ~
    get[Option[Int]]("implementing_agency_id") ~
    get[String]("req_location") ~
    get[PGIntList]("req_attachment_ids") ~
    get[Option[String]]("saro_no") ~
    get[Int]("disaster_id") ~
    get[Int]("gov_unit_id") ~
    get[Boolean]("req_legacy") ~
    get[Option[Int]]("executing_agency_id") map {
      case id~description~projectTypeId~amount~date~level~isRejected~authorId~assessingAgencyId~implementingAgencyId~location~attachmentIds~saroNo~disasterId~govUnitId~isLegacy~executingAgencyId =>
        Req(id, description, projectTypeId, amount, date, level, isRejected, authorId, assessingAgencyId, implementingAgencyId, location, attachmentIds, saroNo, disasterId, govUnitId, isLegacy, executingAgencyId)
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
            req_date,
            req_level,
            req_rejected,
            author_id,
            assessing_agency_id,
            implementing_agency_id,
            req_location,
            req_attachment_ids,
            saro_no,
            disaster_id,
            gov_unit_id,
            req_legacy,
            executing_agency_id
          ) VALUES (
            DEFAULT,
            {description},
            {projectTypeId},
            {amount},
            {date},
            {level},
            {isRejected},
            {authorId},
            {assessingAgencyId},
            {implementingAgencyId},
            {location},
            {attachmentIds},
            {saroNo},
            {disasterId},
            {govUnitId},
            {isLegacy},
            {executingAgencyId}
          )
        """).on(
          'id -> o.id,
          'description -> o.description,
          'projectTypeId -> o.projectTypeId,
          'amount -> o.amount.bigDecimal,
          'date -> o.date,
          'level -> o.level,
          'isRejected -> o.isRejected,
          'authorId -> o.authorId,
          'assessingAgencyId -> o.assessingAgencyId,
          'implementingAgencyId -> o.implementingAgencyId,
          'location -> o.location,
          'attachmentIds -> o.attachmentIds,
          'saroNo -> o.saroNo,
          'disasterId -> o.disasterId,
          'govUnitId -> o.govUnitId,
          'isLegacy -> o.isLegacy,
          'executingAgencyId -> o.executingAgencyId
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
            req_date,
            req_level,
            req_rejected,
            author_id,
            assessing_agency_id,
            implementing_agency_id,
            req_location,
            req_attachment_ids,
            saro_no,
            disaster_id,
            gov_unit_id,
            req_legacy,
            executing_agency_id
          ) VALUES (
            {id},
            {description},
            {projectTypeId},
            {amount},
            {date},
            {level},
            {isRejected},
            {authorId},
            {assessingAgencyId},
            {implementingAgencyId},
            {location},
            {attachmentIds},
            {saroNo},
            {disasterId},
            {govUnitId},
            {isLegacy},
            {executingAgencyId}
          )
        """).on(
          'id -> o.id,
          'description -> o.description,
          'projectTypeId -> o.projectTypeId,
          'amount -> o.amount.bigDecimal,
          'date -> o.date,
          'level -> o.level,
          'isRejected -> o.isRejected,
          'authorId -> o.authorId,
          'assessingAgencyId -> o.assessingAgencyId,
          'implementingAgencyId -> o.implementingAgencyId,
          'location -> o.location,
          'attachmentIds -> o.attachmentIds,
          'saroNo -> o.saroNo,
          'disasterId -> o.disasterId,
          'govUnitId -> o.govUnitId,
          'isLegacy -> o.isLegacy,
          'executingAgencyId -> o.executingAgencyId
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
        req_date={date},
        req_level={level},
        req_rejected={isRejected},
        author_id={authorId},
        assessing_agency_id={assessingAgencyId},
        implementing_agency_id={implementingAgencyId},
        req_location={location},
        req_attachment_ids={attachmentIds},
        saro_no={saroNo},
        disaster_id={disasterId},
        gov_unit_id={govUnitId},
        req_legacy={isLegacy},
        executing_agency_id={executingAgencyId}
      where req_id={id}
    """).on(
      'id -> o.id,
      'description -> o.description,
      'projectTypeId -> o.projectTypeId,
      'amount -> o.amount.bigDecimal,
      'date -> o.date,
      'level -> o.level,
      'isRejected -> o.isRejected,
      'authorId -> o.authorId,
      'assessingAgencyId -> o.assessingAgencyId,
      'implementingAgencyId -> o.implementingAgencyId,
      'location -> o.location,
      'attachmentIds -> o.attachmentIds,
      'saroNo -> o.saroNo,
      'disasterId -> o.disasterId,
      'govUnitId -> o.govUnitId,
      'isLegacy -> o.isLegacy,
      'executingAgencyId -> o.executingAgencyId
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

