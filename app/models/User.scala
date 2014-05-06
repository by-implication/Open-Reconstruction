package recon.models

import anorm._
import anorm.SqlParser._
import com.redis.serialization.Parse.Implicits._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json.{JsNull, Json}
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
            user_name,
            user_password,
            gov_unit_id,
            user_admin
          ) VALUES (
            DEFAULT,
            {handle},
            {name},
            crypt({password}, gen_salt('bf')),
            {govUnitId},
            {isAdmin}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'name -> o.name,
          'password -> o.password,
          'govUnitId -> o.govUnitId,
          'isAdmin -> o.isAdmin
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into users (
            user_id,
            user_handle,
            user_name,
            user_password,
            gov_unit_id,
            user_admin
          ) VALUES (
            {id},
            {handle},
            {name},
            crypt({password}, gen_salt('bf')),
            {govUnitId},
            {isAdmin}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'name -> o.name,
          'password -> o.password,
          'govUnitId -> o.govUnitId,
          'isAdmin -> o.isAdmin
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  override def update(o: User): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update users set
        user_handle={handle},
        user_name={name},
        gov_unit_id={govUnitId}
        user_admin={isAdmin}
      where user_id={id}
    """).on(
      'id -> o.id,
      'handle -> o.handle,
      'name -> o.name,
      'govUnitId -> o.govUnitId,
      'isAdmin -> o.isAdmin
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
  name: String = "",
  password: String = "",
  govUnitId: Int = 0,
  isAdmin: Boolean = false
) extends UserCCGen with Entity[User]
// GENERATED case class end
{

  lazy val infoJson = {
    if(!isAnonymous){
      Json.obj(
        "handle" -> handle,
        "id" -> id.get,
        "name" -> name,
        "govUnit" -> Json.obj(
          "name" -> govUnit.name,
          "acronym" -> govUnit.acronym,
          "id" -> govUnit.id.get,
          "role" -> Role.findById(govUnit.roleId).map(_.name)
        ),
        "isAdmin" -> isAdmin,
        "isSuperAdmin" -> isSuperAdmin,
        "permissions" -> permissions
      )
    } else JsNull
  }

  lazy val govUnit = GovUnit.findById(govUnitId).get

  lazy val permissions = role.permissions

  private lazy val OCD = "OCD"
  private lazy val OP = "OP"
  private lazy val DBM = "DBM"

  lazy val isSuperAdmin = !isAnonymous && role.name == OCD
  lazy val isOP = !isAnonymous && role.name == OP
  lazy val isDBM = !isAnonymous && role.name == DBM

  lazy val role: Role = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM roles NATURAL join gov_units
      WHERE gov_unit_id = {govUnitId}
    """).on('govUnitId -> govUnitId).singleOpt(Role.simple).getOrElse(Role.VIEW_ONLY)
  }

  var sessionId = -1

  def authoredRequests: Seq[Req] = Req.authoredBy(id)

  def isInvolvedWith(r: Req): Boolean = {
    !isAnonymous && (r.authorId == id.get || {role.name match {
      case OCD | OP | DBM => true
      case _ => r.assessingAgencyId.map(_ == govUnitId).getOrElse(false)
    }})
  }

  def hasSignedoff(r: Req): Boolean = {
    isInvolvedWith(r) && {
      val checks = List[Boolean](
        false,
        (r.assessingAgencyId.map(_ == govUnitId).getOrElse(false)),
        isSuperAdmin,
        isOP,
        isDBM
      )
      checks.take(r.level).foldLeft(false)(_ || _)
    }
  }

  def canCreateRequests = canDo(Permission.CREATE_REQUESTS)
  def canAssignFunding = canDo(Permission.ASSIGN_FUNDING)

  def canSignoff(r: Req): Boolean = {
    if(isAnonymous) {
      false
    } else {
      r.level match {
        case 1 => r.assessingAgencyId.map(_ == govUnitId).getOrElse(false)
        case 2 => isSuperAdmin
        case 3 => isOP
        case 4 => isDBM
        case _ => false
      }
    }
  }

  private def canDo(p: Permission): Boolean = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM users NATURAL join gov_units NATURAL JOIN roles
      WHERE user_id = {userId} AND {permission} = ANY(role_permissions)
    """).on(
      'userId -> id,
      'permission -> p.value
    ).list(User.simple).length > 0
  }

  def canEditRequest(r: Req): Boolean = DB.withConnection { implicit c =>
    isSuperAdmin ||
    r.authorId == id.get ||
    r.assessingAgencyId.map(_ == govUnitId && r.level < 1).getOrElse(false) ||
    r.implementingAgencyId.map(_ == govUnitId).getOrElse(false)
  }

  def isAnonymous = id.get == -1

}

// GENERATED object start
trait UserGen extends EntityCompanion[User] {
  val simple = {
    get[Pk[Int]]("user_id") ~
    get[String]("user_handle") ~
    get[String]("user_name") ~
    get[String]("user_password") ~
    get[Int]("gov_unit_id") ~
    get[Boolean]("user_admin") map {
      case id~handle~name~password~govUnitId~isAdmin =>
        User(id, handle, name, password, govUnitId, isAdmin)
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
            user_name,
            user_password,
            gov_unit_id,
            user_admin
          ) VALUES (
            DEFAULT,
            {handle},
            {name},
            {password},
            {govUnitId},
            {isAdmin}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'name -> o.name,
          'password -> o.password,
          'govUnitId -> o.govUnitId,
          'isAdmin -> o.isAdmin
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into users (
            user_id,
            user_handle,
            user_name,
            user_password,
            gov_unit_id,
            user_admin
          ) VALUES (
            {id},
            {handle},
            {name},
            {password},
            {govUnitId},
            {isAdmin}
          )
        """).on(
          'id -> o.id,
          'handle -> o.handle,
          'name -> o.name,
          'password -> o.password,
          'govUnitId -> o.govUnitId,
          'isAdmin -> o.isAdmin
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: User): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update users set
        user_handle={handle},
        user_name={name},
        user_password={password},
        gov_unit_id={govUnitId},
        user_admin={isAdmin}
      where user_id={id}
    """).on(
      'id -> o.id,
      'handle -> o.handle,
      'name -> o.name,
      'password -> o.password,
      'govUnitId -> o.govUnitId,
      'isAdmin -> o.isAdmin
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

