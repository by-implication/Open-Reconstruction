package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.Play.current
import recon.support._

object Project extends ProjectGen {
}

// GENERATED case class start
case class Project(
  id: Pk[Int] = NA,
  date: Timestamp = Time.now,
  code: String = "",
  level: Int = 0,
  isRejected: Boolean = false,
  authorId: Int = 0,
  implementingAgencyId: Int = 0,
  kind: ProjectTypes = ProjectTypes.INFRASTRUCTURE,
  description: String = "",
  amount: BigDecimal = 0,
  location: String = "",
  remarks: Option[String] = None,
  attachments: PGIntList = Nil,
  disasterId: Int = 0
) extends ProjectCCGen with Entity[Project]
// GENERATED case class end

// GENERATED object start
trait ProjectGen extends EntityCompanion[Project] {
  val simple = {
    get[Pk[Int]]("project_id") ~
    get[Timestamp]("project_date") ~
    get[String]("project_code") ~
    get[Int]("project_level") ~
    get[Boolean]("project_rejected") ~
    get[Int]("author_id") ~
    get[Int]("implementing_agency_id") ~
    get[ProjectTypes]("project_kind") ~
    get[String]("project_description") ~
    get[java.math.BigDecimal]("project_amount") ~
    get[String]("project_location") ~
    get[Option[String]]("project_remarks") ~
    get[PGIntList]("project_attachments") ~
    get[Int]("disaster_id") map {
      case id~date~code~level~isRejected~authorId~implementingAgencyId~kind~description~amount~location~remarks~attachments~disasterId =>
        Project(id, date, code, level, isRejected, authorId, implementingAgencyId, kind, description, amount, location, remarks, attachments, disasterId)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from projects where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Project] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Project] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Project] = findOne("project_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Project] = DB.withConnection { implicit c =>
    SQL("select * from projects limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Project): Option[Project] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into projects (
            project_id,
            project_date,
            project_code,
            project_level,
            project_rejected,
            author_id,
            implementing_agency_id,
            project_kind,
            project_description,
            project_amount,
            project_location,
            project_remarks,
            project_attachments,
            disaster_id
          ) VALUES (
            DEFAULT,
            {date},
            {code},
            {level},
            {isRejected},
            {authorId},
            {implementingAgencyId},
            {kind},
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
          'kind -> o.kind,
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
          insert into projects (
            project_id,
            project_date,
            project_code,
            project_level,
            project_rejected,
            author_id,
            implementing_agency_id,
            project_kind,
            project_description,
            project_amount,
            project_location,
            project_remarks,
            project_attachments,
            disaster_id
          ) VALUES (
            {id},
            {date},
            {code},
            {level},
            {isRejected},
            {authorId},
            {implementingAgencyId},
            {kind},
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
          'kind -> o.kind,
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

  def update(o: Project): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update projects set
        project_date={date},
        project_code={code},
        project_level={level},
        project_rejected={isRejected},
        author_id={authorId},
        implementing_agency_id={implementingAgencyId},
        project_kind={kind},
        project_description={description},
        project_amount={amount},
        project_location={location},
        project_remarks={remarks},
        project_attachments={attachments},
        disaster_id={disasterId}
      where project_id={id}
    """).on(
      'id -> o.id,
      'date -> o.date,
      'code -> o.code,
      'level -> o.level,
      'isRejected -> o.isRejected,
      'authorId -> o.authorId,
      'implementingAgencyId -> o.implementingAgencyId,
      'kind -> o.kind,
      'description -> o.description,
      'amount -> o.amount.bigDecimal,
      'location -> o.location,
      'remarks -> o.remarks,
      'attachments -> o.attachments,
      'disasterId -> o.disasterId
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from projects where project_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait ProjectCCGen {
  val companion = Project
}
// GENERATED object end

