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

}

// GENERATED case class start
case class User(
  id: Pk[Int] = NA,
  handle: String = "",
  password: String = "",
  kind: UserType = UserType.LGU
) extends UserCCGen with Entity[User]
// GENERATED case class end
{

  var sessionId = -1

  def canCreateRequests = {
    import UserType._
    Seq(LGU, GOCC, NGA) contains kind
  }

  def isAnonymous = id.get == -1

}

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

