/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object GovUnit extends GovUnitGen {

  def search(s: String): Seq[GovUnit] = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM gov_units
      WHERE gov_unit_search_key ILIKE {searchKey}
      ORDER BY
        length(gov_unit_search_key) ASC,
        gov_unit_search_key ASC
      LIMIT 5
    """).on('searchKey -> ("%" + s.split(" ").mkString("%") + "%")).list(simple)
  }

  def findByName(name: String): Option[GovUnit] = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM gov_units
      WHERE gov_unit_name = {name}
      LIMIT 1
    """).on(
      'name -> name
    ).singleOpt(simple)
  }

  def findByAcronym(acronym: String): Option[GovUnit] = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM gov_units
      WHERE gov_unit_acronym = {acronym}
      LIMIT 1
    """).on(
      'acronym -> acronym
    ).singleOpt(simple)
  }

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

}

// GENERATED case class start
case class GovUnit(
  id: Pk[Int] = NA,
  name: String = "",
  acronym: Option[String] = None,
  roleId: Int = 0,
  searchKey: String = ""
) extends GovUnitCCGen with Entity[GovUnit]
// GENERATED case class end
{

  def withUpdatedSearchKey() = copy(searchKey = (lguOpt.map { lgu =>
    if(lgu.ancestors.isEmpty){
      name
    } else {
      (lgu.ancestors.map(_.name) :+ name).reverse.mkString(", ")
    }
  }.getOrElse(name)))

  lazy val lguOpt = Lgu.findById(id)

  def coords: Option[Map[String, BigDecimal]] = {
    for {
      lgu <- lguOpt
      lat <- Some(lgu.lat.getOrElse(lgu.getMeanLat))
      lng <- Some(lgu.lng.getOrElse(lgu.getMeanLng))
    } yield {
      Map(
        "lat" -> lat,
        "lng" -> lng
      )
    }
  }

  def requests(p: Int): (Seq[Req], Long) = DB.withConnection { implicit c =>
    
    val limit = Req.PAGE_LIMIT

    val r = SQL("""
      SELECT *, COUNT(*) OVER() FROM reqs
      WHERE gov_unit_id = {id}
      LIMIT {limit} OFFSET {offset}
    """).on(
      'id -> id,
      'limit -> limit,
      'offset -> (p-1) * limit
    )

    val list = r.list(Req.simple)
    val count: Long = r.list(get[Long]("count")).headOption.getOrElse(0)

    (list, count)

  }

  def canAssess = canDo(Permission.VALIDATE_REQUESTS)
  def canImplement = canDo(Permission.IMPLEMENT_REQUESTS)

  def users:Seq[User] = GovUnit.users(id)

  def filterJson: JsObject = {
    Json.obj(
      "id" -> id.toInt,
      "name" -> name,
      "acronym" -> (acronym.getOrElse(""): String)
    )
  }

  def toJson: JsObject = {
    Json.obj(
      "id" -> id.toInt,
      "name" -> name,
      "acronym" -> (acronym.getOrElse(""): String),
      "totalUsers" -> users.length,
      "roleId" -> roleId,
      "role" -> role.name,
      "coords" -> coords
    )
  }

  lazy val role = Role.findById(roleId).get

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
    get[Int]("role_id") ~
    get[String]("gov_unit_search_key") map {
      case id~name~acronym~roleId~searchKey =>
        GovUnit(id, name, acronym, roleId, searchKey)
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

  def listAll(): Seq[GovUnit] = DB.withConnection { implicit c =>
    SQL("select * from gov_units order by gov_unit_id").list(simple)
  }

  def insert(o: GovUnit): Option[GovUnit] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into gov_units (
            gov_unit_id,
            gov_unit_name,
            gov_unit_acronym,
            role_id,
            gov_unit_search_key
          ) VALUES (
            DEFAULT,
            {name},
            {acronym},
            {roleId},
            {searchKey}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'acronym -> o.acronym,
          'roleId -> o.roleId,
          'searchKey -> o.searchKey
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into gov_units (
            gov_unit_id,
            gov_unit_name,
            gov_unit_acronym,
            role_id,
            gov_unit_search_key
          ) VALUES (
            {id},
            {name},
            {acronym},
            {roleId},
            {searchKey}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'acronym -> o.acronym,
          'roleId -> o.roleId,
          'searchKey -> o.searchKey
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: GovUnit): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update gov_units set
        gov_unit_name={name},
        gov_unit_acronym={acronym},
        role_id={roleId},
        gov_unit_search_key={searchKey}
      where gov_unit_id={id}
    """).on(
      'id -> o.id,
      'name -> o.name,
      'acronym -> o.acronym,
      'roleId -> o.roleId,
      'searchKey -> o.searchKey
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

