package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object DisasterType extends DisasterTypeGen {
  def jsonList = Json.toJson(listAll.map(_.toJson))
}

// GENERATED case class start
case class DisasterType(
  id: Pk[Int] = NA,
  name: String = ""
) extends DisasterTypeCCGen with Entity[DisasterType]
// GENERATED case class end
{
  def toJson = Json.obj(
    "id" -> id.get,
    "name" -> name
  )
}

// GENERATED object start
trait DisasterTypeGen extends EntityCompanion[DisasterType] {
  val simple = {
    get[Pk[Int]]("disaster_type_id") ~
    get[String]("disaster_type_name") map {
      case id~name =>
        DisasterType(id, name)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from disaster_types where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[DisasterType] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[DisasterType] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[DisasterType] = findOne("disaster_type_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[DisasterType] = DB.withConnection { implicit c =>
    SQL("select * from disaster_types limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[DisasterType] = DB.withConnection { implicit c =>
    SQL("select * from disaster_types").list(simple)
  }

  def insert(o: DisasterType): Option[DisasterType] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into disaster_types (
            disaster_type_id,
            disaster_type_name
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
          insert into disaster_types (
            disaster_type_id,
            disaster_type_name
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

  def update(o: DisasterType): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update disaster_types set
        disaster_type_name={name}
      where disaster_type_id={id}
    """).on(
      'id -> o.id,
      'name -> o.name
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from disaster_types where disaster_type_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait DisasterTypeCCGen {
  val companion = DisasterType
}
// GENERATED object end

