package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.Timestamp
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Saro extends SaroGen {
}

// GENERATED case class start
case class Saro(
  id: Pk[Int] = NA,
  number: String = "",
  isPublic: Boolean = false,
  amount: BigDecimal = 0
) extends SaroCCGen with Entity[Saro]
// GENERATED case class end

// GENERATED object start
trait SaroGen extends EntityCompanion[Saro] {
  val simple = {
    get[Pk[Int]]("saro_id") ~
    get[String]("saro_number") ~
    get[Boolean]("saro_public") ~
    get[java.math.BigDecimal]("saro_amount") map {
      case id~number~isPublic~amount =>
        Saro(id, number, isPublic, amount)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from saros where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Saro] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Saro] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Saro] = findOne("saro_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Saro] = DB.withConnection { implicit c =>
    SQL("select * from saros limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[Saro] = DB.withConnection { implicit c =>
    SQL("select * from saros order by saro_id").list(simple)
  }

  def insert(o: Saro): Option[Saro] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into saros (
            saro_id,
            saro_number,
            saro_public,
            saro_amount
          ) VALUES (
            DEFAULT,
            {number},
            {isPublic},
            {amount}
          )
        """).on(
          'id -> o.id,
          'number -> o.number,
          'isPublic -> o.isPublic,
          'amount -> o.amount.bigDecimal
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into saros (
            saro_id,
            saro_number,
            saro_public,
            saro_amount
          ) VALUES (
            {id},
            {number},
            {isPublic},
            {amount}
          )
        """).on(
          'id -> o.id,
          'number -> o.number,
          'isPublic -> o.isPublic,
          'amount -> o.amount.bigDecimal
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Saro): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update saros set
        saro_number={number},
        saro_public={isPublic},
        saro_amount={amount}
      where saro_id={id}
    """).on(
      'id -> o.id,
      'number -> o.number,
      'isPublic -> o.isPublic,
      'amount -> o.amount.bigDecimal
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from saros where saro_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait SaroCCGen {
  val companion = Saro
}
// GENERATED object end

