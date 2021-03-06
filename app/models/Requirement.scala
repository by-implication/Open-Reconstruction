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

object Requirement extends RequirementGen {

  def getForGovUnitId(govUnitId: Int) = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM requirements, gov_units NATURAL JOIN roles
      WHERE gov_unit_id = {govUnitId}
      AND requirement_target = (CASE
        WHEN role_name = 'LGU' THEN 'LGU'
        ELSE 'NGA'
      END)
    """).on('govUnitId -> govUnitId).list(simple)
  }

  def getFor(role: Role, submissionOnly: Boolean = false) = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM requirements
      WHERE requirement_target = {target}
    """ + (if (submissionOnly) "AND req_level = 0" else "") + """
      ORDER BY req_level ASC
    """).on('target -> (if (role.name == "LGU") "LGU" else "NGA")).list(simple)
  }

}

// GENERATED case class start
case class Requirement(
  id: Pk[Int] = NA,
  name: String = "",
  description: String = "",
  reqLevel: Int = 0,
  target: String = "",
  isImage: Boolean = false,
  isDeprecated: Boolean = false
) extends RequirementCCGen with Entity[Requirement]
// GENERATED case class end
{
  def toJson = Json.obj(
    "id" -> id,
    "name" -> name,
    "description" -> description,
    "level" -> reqLevel,
    "target" -> target,
    "isImage" -> isImage
  )
}

// GENERATED object start
trait RequirementGen extends EntityCompanion[Requirement] {
  val simple = {
    get[Pk[Int]]("requirement_id") ~
    get[String]("requirement_name") ~
    get[String]("requirement_description") ~
    get[Int]("req_level") ~
    get[String]("requirement_target") ~
    get[Boolean]("requirement_image") ~
    get[Boolean]("requirement_deprecated") map {
      case id~name~description~reqLevel~target~isImage~isDeprecated =>
        Requirement(id, name, description, reqLevel, target, isImage, isDeprecated)
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
            requirement_target,
            requirement_image,
            requirement_deprecated
          ) VALUES (
            DEFAULT,
            {name},
            {description},
            {reqLevel},
            {target},
            {isImage},
            {isDeprecated}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'description -> o.description,
          'reqLevel -> o.reqLevel,
          'target -> o.target,
          'isImage -> o.isImage,
          'isDeprecated -> o.isDeprecated
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
            requirement_target,
            requirement_image,
            requirement_deprecated
          ) VALUES (
            {id},
            {name},
            {description},
            {reqLevel},
            {target},
            {isImage},
            {isDeprecated}
          )
        """).on(
          'id -> o.id,
          'name -> o.name,
          'description -> o.description,
          'reqLevel -> o.reqLevel,
          'target -> o.target,
          'isImage -> o.isImage,
          'isDeprecated -> o.isDeprecated
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
        requirement_target={target},
        requirement_image={isImage},
        requirement_deprecated={isDeprecated}
      where requirement_id={id}
    """).on(
      'id -> o.id,
      'name -> o.name,
      'description -> o.description,
      'reqLevel -> o.reqLevel,
      'target -> o.target,
      'isImage -> o.isImage,
      'isDeprecated -> o.isDeprecated
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

