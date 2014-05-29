package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object ProjectType extends ProjectTypeGen {
  def jsonList = Json.toJson(listAll.map(_.toJson))
}

// GENERATED case class start
case class ProjectType(
  id: Pk[Int] = NA,
  name: String = ""
) extends ProjectTypeCCGen with Entity[ProjectType]
// GENERATED case class end
{
  def toJson = Json.obj(
    "id" -> id.get,
    "name" -> name
  )
}

// GENERATED object start
trait ProjectTypeGen extends EntityCompanion[ProjectType] {
  val simple = {
    get[Pk[Int]]("project_type_id") ~
    get[String]("project_type_name") map {
      case id~name =>
        ProjectType(id, name)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from project_types where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[ProjectType] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[ProjectType] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[ProjectType] = findOne("project_type_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[ProjectType] = DB.withConnection { implicit c =>
    SQL("select * from project_types limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[ProjectType] = DB.withConnection { implicit c =>
    SQL("select * from project_types order by project_type_id").list(simple)
  }

  def insert(o: ProjectType): Option[ProjectType] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into project_types (
            project_type_id,
            project_type_name
          ) VALUES (
            DEFAULT,
            {name}
          )
        """).on(
          'id -> o.id,
          'name -> o.name
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into project_types (
            project_type_id,
            project_type_name
          ) VALUES (
            {id},
            {name}
          )
        """).on(
          'id -> o.id,
          'name -> o.name
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: ProjectType): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update project_types set
        project_type_name={name}
      where project_type_id={id}
    """).on(
      'id -> o.id,
      'name -> o.name
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from project_types where project_type_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait ProjectTypeCCGen {
  val companion = ProjectType
}
// GENERATED object end

