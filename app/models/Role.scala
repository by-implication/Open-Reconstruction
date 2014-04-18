package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Role extends RoleGen {
}

// GENERATED case class start
case class Role(
  id: Pk[Int] = NA,
  name: String = "",
  permissions: PGIntList = Nil
) extends RoleCCGen with Entity[Role]
// GENERATED case class end

// GENERATED object start
trait RoleGen extends EntityCompanion[Role] {
  val simple = {
    get[Pk[Int]]("role_id") ~
    get[String]("role_name") ~
    get[PGIntList]("role_permissions") map {
      case id~name~permissions =>
        Role(id, name, permissions)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from roles where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Role] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Role] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Role] = findOne("role_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Role] = DB.withConnection { implicit c =>
    SQL("select * from roles limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: Role): Option[Role] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into roles (
            role_id,
            role_name,
            role_permissions
          ) VALUES (
            DEFAULT,
            {name},
            {permissions}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'permissions -> o.permissions
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into roles (
            role_id,
            role_name,
            role_permissions
          ) VALUES (
            {id},
            {name},
            {permissions}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'permissions -> o.permissions
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Role): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update roles set
        role_name={name},
        role_permissions={permissions}
      where role_id={id}
    """).on(
      'id -> o.id,
      'name -> o.name,
      'permissions -> o.permissions
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from roles where role_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait RoleCCGen {
  val companion = Role
}
// GENERATED object end

case class Permission(value: Int)

object Permission {

  val CREATE_REQUESTS = Permission(1)
  val VALIDATE_REQUESTS = Permission(2)
  val EDIT_REQUESTS = Permission(3)
  val IMPLEMENT_REQUESTS = Permission(4)
  val SIGNOFF = Permission(5)
  val ASSIGN_FUNDING = Permission(6)

}
