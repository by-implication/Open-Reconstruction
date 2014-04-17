package recon.models

import anorm._
import anorm.SqlParser._
import com.redis.serialization.Parse.Implicits._
import java.sql.Timestamp
import play.api.db._
import play.api.mvc.RequestHeader
import play.api.Play.current
import recon.support._

object User extends UserGen {

  override def insert(o: User): Option[User] = DB.withConnection { implicit c =>
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
            crypt({password}, gen_salt('bf')),
            {agencyId}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'password -> o.password,
          'agencyId -> o.agencyId
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
            crypt({password}, gen_salt('bf')),
            {agencyId}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'password -> o.password,
          'agencyId -> o.agencyId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  override def update(o: User): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update users set
        user_handle={handle},
        user_kind={agencyId}
      where user_id={id}
    """).on(
      'id -> o.id,
      'handle -> o.handle,
      'agencyId -> o.agencyId
    ).executeUpdate() > 0
  }

  def changePassword(id: Int, oldPassword: String, newPassword: String): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update users set user_password = crypt({new}, gen_salt('bf'))
      where user_id = {id} and user_password = crypt({old}, user_password)
    """).on(
      'id -> id,
      'old -> oldPassword,
      'new -> newPassword
    ).executeUpdate() > 0
  }

  def resetPassword(id: Int, newPassword: String): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update users set user_password = crypt({new}, gen_salt('bf'))
      where user_id = {id}
    """).on(
      'id -> id,
      'new -> newPassword
    ).executeUpdate() > 0
  }

  def Anon(implicit request: RequestHeader) = {
    
    val anon = User(id = Id(-1))

    anon.sessionId = {
      request.session.get("session_id").map(_.toInt)
      .getOrElse(Redis.xaction { r =>    
        r.get[Int]("sessionCount") match {
          case Some(n) => r.incr("sessionCount"); n+1
          case None => r.set("sessionCount", 1); 1
        }
      })
    }

    anon

  }

  def authenticate(handle: String, password: String): Option[User] = DB.withConnection { implicit c =>
    SQL("select * from users where user_handle ilike {handle} and user_password = crypt({password}, user_password)")
    .on('handle -> handle, 'password -> password)
    .singleOpt(simple)
  }

}

// GENERATED case class start
case class User(
  id: Pk[Int] = NA,
  handle: String = "",
  password: String = "",
  agencyId: Int = 0
) extends UserCCGen with Entity[User]
// GENERATED case class end
{

  var sessionId = -1

  def canCreateRequests = canDo(Permission.CREATE_REQUESTS)

  private def canDo(p: Permission): Boolean = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM users NATURAL JOIN agencys NATURAL JOIN roles
      WHERE user_id = {userId} AND = {pName} ANY role_permissions
    """).on(
      'userId -> id,
      'pName -> p.name
    ).list(User.simple).length > 0
  }

  def isAnonymous = id.get == -1

}

// GENERATED object start
trait UserGen extends EntityCompanion[User] {
  val simple = {
    get[Pk[Int]]("user_id") ~
    get[String]("user_handle") ~
    get[String]("user_password") ~
    get[Int]("agency_id") map {
      case id~handle~password~agencyId =>
        User(id, handle, password, agencyId)
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
            agency_id
          ) VALUES (
            DEFAULT,
            {handle},
            {password},
            {agencyId}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'password -> o.password,
          'agencyId -> o.agencyId
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into users (
            user_id,
            user_handle,
            user_password,
            agency_id
          ) VALUES (
            {id},
            {handle},
            {password},
            {agencyId}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'password -> o.password,
          'agencyId -> o.agencyId
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: User): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update users set
        user_handle={handle},
        user_password={password},
        agency_id={agencyId}
      where user_id={id}
    """).on(
      'id -> o.id,
      'handle -> o.handle,
      'password -> o.password,
      'agencyId -> o.agencyId
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

