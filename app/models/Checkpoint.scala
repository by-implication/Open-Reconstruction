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

object Checkpoint extends CheckpointGen {

  def push(user: User)(implicit req: Req): Option[Checkpoint] = {
    val newLevel: Int = req.currentCheckpoint.map(
      _.copy(userId = user.id.toOption, dateCompleted = Some(Time.now)).save()
      .map(_.level + 1)
    ).flatten.getOrElse(0)
    val govUnitId: Option[Int] = newLevel match {
      case 0 => GovUnit.findOne("gov_unit_acronym", "OCD").map(_.id)
      case 1 => req.assessingAgencyId // assessing agency
      case 2 => GovUnit.findOne("gov_unit_acronym", "OCD").map(_.id)
      case 3 => GovUnit.findOne("gov_unit_acronym", "OP").map(_.id)
      case 4 => GovUnit.findOne("gov_unit_acronym", "DBM").map(_.id)
      case _ => None
    }
    govUnitId.map { guId =>
      Checkpoint(reqId = req.id, level = newLevel).copy(govUnitId = guId).create()
    }.flatten
  }

  def pop()(implicit req: Req) = req.currentCheckpoint.map(_.delete())

}

// GENERATED case class start
case class Checkpoint(
  id: Pk[Int] = NA,
  reqId: Int = 0,
  govUnitId: Int = 0,
  userId: Option[Int] = None,
  level: Int = 0,
  dateReceived: Timestamp = Time.now,
  dateCompleted: Option[Timestamp] = None
) extends CheckpointCCGen with Entity[Checkpoint]
// GENERATED case class end
{
  lazy val duration: Long = dateCompleted.getOrElse(Time.now).getTime() - dateReceived.getTime()
}

// GENERATED object start
trait CheckpointGen extends EntityCompanion[Checkpoint] {
  val simple = {
    get[Pk[Int]]("checkpoint_id") ~
    get[Int]("req_id") ~
    get[Int]("gov_unit_id") ~
    get[Option[Int]]("user_id") ~
    get[Int]("checkpoint_level") ~
    get[Timestamp]("checkpoint_date_received") ~
    get[Option[Timestamp]]("checkpoint_date_completed") map {
      case id~reqId~govUnitId~userId~level~dateReceived~dateCompleted =>
        Checkpoint(id, reqId, govUnitId, userId, level, dateReceived, dateCompleted)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from checkpoints where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Checkpoint] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Checkpoint] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Checkpoint] = findOne("checkpoint_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Checkpoint] = DB.withConnection { implicit c =>
    SQL("select * from checkpoints limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[Checkpoint] = DB.withConnection { implicit c =>
    SQL("select * from checkpoints order by checkpoint_id").list(simple)
  }

  def insert(o: Checkpoint): Option[Checkpoint] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into checkpoints (
            checkpoint_id,
            req_id,
            gov_unit_id,
            user_id,
            checkpoint_level,
            checkpoint_date_received,
            checkpoint_date_completed
          ) VALUES (
            DEFAULT,
            {reqId},
            {govUnitId},
            {userId},
            {level},
            {dateReceived},
            {dateCompleted}
          )
        """).on(
          'id -> o.id,
          'reqId -> o.reqId,
          'govUnitId -> o.govUnitId,
          'userId -> o.userId,
          'level -> o.level,
          'dateReceived -> o.dateReceived,
          'dateCompleted -> o.dateCompleted
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into checkpoints (
            checkpoint_id,
            req_id,
            gov_unit_id,
            user_id,
            checkpoint_level,
            checkpoint_date_received,
            checkpoint_date_completed
          ) VALUES (
            {id},
            {reqId},
            {govUnitId},
            {userId},
            {level},
            {dateReceived},
            {dateCompleted}
          )
        """).on(
          'id -> o.id,
          'reqId -> o.reqId,
          'govUnitId -> o.govUnitId,
          'userId -> o.userId,
          'level -> o.level,
          'dateReceived -> o.dateReceived,
          'dateCompleted -> o.dateCompleted
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Checkpoint): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update checkpoints set
        req_id={reqId},
        gov_unit_id={govUnitId},
        user_id={userId},
        checkpoint_level={level},
        checkpoint_date_received={dateReceived},
        checkpoint_date_completed={dateCompleted}
      where checkpoint_id={id}
    """).on(
      'id -> o.id,
      'reqId -> o.reqId,
      'govUnitId -> o.govUnitId,
      'userId -> o.userId,
      'level -> o.level,
      'dateReceived -> o.dateReceived,
      'dateCompleted -> o.dateCompleted
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from checkpoints where checkpoint_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait CheckpointCCGen {
  val companion = Checkpoint
}
// GENERATED object end

