package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Project extends ProjectGen {}

// GENERATED case class start
case class Project(
  id: Pk[Int] = NA,
  reqId: Int = 0,
  projectSourceId: String = "",
  name: String = "",
  amount: BigDecimal = 0,
  govUnitId: Int = 0,
  projectTypeId: Int = 0,
  scope: ProjectScope = ProjectScope.REPAIR,
  isFunded: Boolean = false
) extends ProjectCCGen with Entity[Project]
// GENERATED case class end
{
  lazy val req: Req = Req.findById(reqId).get

  lazy val disasterName: Option[String] = req.disasterName

  def requestViewJson: JsObject = Json.obj(
    "id" -> id.get,
    "name" -> name,
    "amount" -> amount,
    "scope" -> scope.toString
  )
}
// GENERATED object start
trait ProjectGen extends EntityCompanion[Project] {
  val simple = {
    get[Pk[Int]]("project_id") ~
    get[Int]("req_id") ~
    get[String]("project_source_id") ~
    get[String]("project_name") ~
    get[java.math.BigDecimal]("project_amount") ~
    get[Int]("gov_unit_id") ~
    get[Int]("project_type_id") ~
    get[ProjectScope]("project_scope") ~
    get[Boolean]("project_funded") map {
      case id~reqId~projectSourceId~name~amount~govUnitId~projectTypeId~scope~isFunded =>
        Project(id, reqId, projectSourceId, name, amount, govUnitId, projectTypeId, scope, isFunded)
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

  def listAll(): Seq[Project] = DB.withConnection { implicit c =>
    SQL("select * from projects order by project_id").list(simple)
  }

  def insert(o: Project): Option[Project] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into projects (
            project_id,
            req_id,
            project_source_id,
            project_name,
            project_amount,
            gov_unit_id,
            project_type_id,
            project_scope,
            project_funded
          ) VALUES (
            DEFAULT,
            {reqId},
            {projectSourceId},
            {name},
            {amount},
            {govUnitId},
            {projectTypeId},
            {scope},
            {isFunded}
          )
        """).on(
          'id -> o.id,
          'reqId -> o.reqId,
          'projectSourceId -> o.projectSourceId,
          'name -> o.name,
          'amount -> o.amount.bigDecimal,
          'govUnitId -> o.govUnitId,
          'projectTypeId -> o.projectTypeId,
          'scope -> o.scope,
          'isFunded -> o.isFunded
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into projects (
            project_id,
            req_id,
            project_source_id,
            project_name,
            project_amount,
            gov_unit_id,
            project_type_id,
            project_scope,
            project_funded
          ) VALUES (
            {id},
            {reqId},
            {projectSourceId},
            {name},
            {amount},
            {govUnitId},
            {projectTypeId},
            {scope},
            {isFunded}
          )
        """).on(
          'id -> o.id,
          'reqId -> o.reqId,
          'projectSourceId -> o.projectSourceId,
          'name -> o.name,
          'amount -> o.amount.bigDecimal,
          'govUnitId -> o.govUnitId,
          'projectTypeId -> o.projectTypeId,
          'scope -> o.scope,
          'isFunded -> o.isFunded
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Project): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update projects set
        req_id={reqId},
        project_source_id={projectSourceId},
        project_name={name},
        project_amount={amount},
        gov_unit_id={govUnitId},
        project_type_id={projectTypeId},
        project_scope={scope},
        project_funded={isFunded}
      where project_id={id}
    """).on(
      'id -> o.id,
      'reqId -> o.reqId,
      'projectSourceId -> o.projectSourceId,
      'name -> o.name,
      'amount -> o.amount.bigDecimal,
      'govUnitId -> o.govUnitId,
      'projectTypeId -> o.projectTypeId,
      'scope -> o.scope,
      'isFunded -> o.isFunded
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

