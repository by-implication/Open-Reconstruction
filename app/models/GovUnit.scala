package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object GovUnit extends GovUnitGen {

  def listAgencies = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM gov_units g
      LEFT JOIN lgus l
      ON g.gov_unit_id = l.lgu_id
      WHERE l.lgu_id IS NULL
    """).list(simple)
  }

  def withPermission(permission: Permission) = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM gov_units
      NATURAL JOIN roles
      WHERE {permission} = ANY(roles.role_permissions)
    """).on(
      'permission -> permission.value
    ).list(simple)
  }

  def users(id: Int): Seq[User] = DB.withConnection { implicit c =>
    SQL("""
      SELECT * from users
      WHERE gov_unit_id = {id}
    """).on(
      'id -> id
    ).list(User.simple)
  }

  def canAssess(a: GovUnit) = a.canDo(Permission.VALIDATE_REQUESTS)
  def canImplement(a: GovUnit) = a.canDo(Permission.IMPLEMENT_REQUESTS)

}

// GENERATED case class start
case class GovUnit(
  id: Pk[Int] = NA,
  name: String = "",
  acronym: Option[String] = None,
  roleId: Int = 0
) extends GovUnitCCGen with Entity[GovUnit]
// GENERATED case class end
{

  def users:Seq[User] = GovUnit.users(id)

  def toJson: JsObject = {
    Json.obj(
      "id" -> id.toInt,
      "name" -> name,
      "acronym" -> (acronym.getOrElse(""): String),
      "totalUsers" -> users.length,
      "role" -> Role.findById(roleId).map(_.name)
    )
  }

  private def canDo(p: Permission): Boolean = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM gov_units NATURAL JOIN roles
      WHERE gov_unit_id = {govUnitId} AND {permission} = ANY(role_permissions)
    """).on(
      'govUnitId -> id,
      'permission -> p.value
    ).list(GovUnit.simple).length > 0
  }

}

// GENERATED object start
trait GovUnitGen extends EntityCompanion[GovUnit] {
  val simple = {
    get[Pk[Int]]("gov_unit_id") ~
    get[String]("gov_unit_name") ~
    get[Option[String]]("gov_unit_acronym") ~
    get[Int]("role_id") map {
      case id~name~acronym~roleId =>
        GovUnit(id, name, acronym, roleId)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from gov_units where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[GovUnit] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[GovUnit] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[GovUnit] = findOne("gov_unit_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[GovUnit] = DB.withConnection { implicit c =>
    SQL("select * from gov_units limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: GovUnit): Option[GovUnit] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into gov_units (
            gov_unit_id,
            gov_unit_name,
            gov_unit_acronym,
            role_id
          ) VALUES (
            DEFAULT,
            {name},
            {acronym},
            {roleId}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'acronym -> o.acronym,
          'roleId -> o.roleId
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into gov_units (
            gov_unit_id,
            gov_unit_name,
            gov_unit_acronym,
            role_id
          ) VALUES (
            {id},
            {name},
            {acronym},
            {roleId}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'acronym -> o.acronym,
          'roleId -> o.roleId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: GovUnit): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update gov_units set
        gov_unit_name={name},
        gov_unit_acronym={acronym},
        role_id={roleId}
      where gov_unit_id={id}
    """).on(
      'id -> o.id,
      'name -> o.name,
      'acronym -> o.acronym,
      'roleId -> o.roleId
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from gov_units where gov_unit_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait GovUnitCCGen {
  val companion = GovUnit
}
// GENERATED object end

