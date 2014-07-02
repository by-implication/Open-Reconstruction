package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Requirement extends RequirementGen {
}

// GENERATED case class start
case class Requirement(
  id: Pk[Int] = NA,
  name: String = "",
  description: String = "",
  reqLevel: Int = 0,
  roleId: Int = 0
) extends RequirementCCGen with Entity[Requirement]
// GENERATED case class end

// GENERATED object start
trait RequirementGen extends EntityCompanion[Requirement] {
  val simple = {
    get[Pk[Int]]("requirement_id") ~
    get[String]("requirement_name") ~
    get[String]("requirement_description") ~
    get[Int]("req_level") ~
    get[Int]("role_id") map {
      case id~name~description~reqLevel~roleId =>
        Requirement(id, name, description, reqLevel, roleId)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from requirements where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Requirement] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Requirement] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Requirement] = findOne("requirement_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Requirement] = DB.withConnection { implicit c =>
    SQL("select * from requirements limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[Requirement] = DB.withConnection { implicit c =>
    SQL("select * from requirements order by requirement_id").list(simple)
  }

  def insert(o: Requirement): Option[Requirement] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into requirements (
            requirement_id,
            requirement_name,
            requirement_description,
            req_level,
            role_id
          ) VALUES (
            DEFAULT,
            {name},
            {description},
            {reqLevel},
            {roleId}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'description -> o.description,
          'reqLevel -> o.reqLevel,
          'roleId -> o.roleId
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into requirements (
            requirement_id,
            requirement_name,
            requirement_description,
            req_level,
            role_id
          ) VALUES (
            {id},
            {name},
            {description},
            {reqLevel},
            {roleId}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'description -> o.description,
          'reqLevel -> o.reqLevel,
          'roleId -> o.roleId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Requirement): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update requirements set
        requirement_name={name},
        requirement_description={description},
        req_level={reqLevel},
        role_id={roleId}
      where requirement_id={id}
    """).on(
      'id -> o.id,
      'name -> o.name,
      'description -> o.description,
      'reqLevel -> o.reqLevel,
      'roleId -> o.roleId
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from requirements where requirement_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait RequirementCCGen {
  val companion = Requirement
}
// GENERATED object end

