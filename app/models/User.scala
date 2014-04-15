package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.Play.current
import recon.support._

object User extends UserGen {
}

// GENERATED case class start
case class User(
  id: Pk[Int] = NA,
  handle: String = "",
  password: String = "",
  kind: UserType = UserType.LGU
) extends UserCCGen with Entity[User]
// GENERATED case class end

// GENERATED object start
trait UserGen extends EntityCompanion[User] {
  val simple = {
    get[Pk[Int]]("user_id") ~
    get[String]("user_handle") ~
    get[String]("user_password") ~
    get[UserType]("user_kind") map {
      case id~handle~password~kind =>
        User(id, handle, password, kind)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from users where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[User] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[User] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[User] = findOne("user_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[User] = DB.withConnection { implicit c =>
    SQL("select * from users limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def insert(o: User): Option[User] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into users (
            user_id,
            user_handle,
            user_password,
            user_kind
          ) VALUES (
            DEFAULT,
            {handle},
            {password},
            {kind}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'password -> o.password,
          'kind -> o.kind
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into users (
            user_id,
            user_handle,
            user_password,
            user_kind
          ) VALUES (
            {id},
            {handle},
            {password},
            {kind}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'password -> o.password,
          'kind -> o.kind
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: User): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update users set
        user_handle={handle},
        user_password={password},
        user_kind={kind}
      where user_id={id}
    """).on(
      'id -> o.id,
      'handle -> o.handle,
      'password -> o.password,
      'kind -> o.kind
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from users where user_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait UserCCGen {
  val companion = User
}
// GENERATED object end

