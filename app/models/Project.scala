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

object Project extends ProjectGen {

  def PAGE_LIMIT = 20

  def indexList(page: Int) = DB.withConnection { implicit c =>

    val r = SQL("""
      SELECT projects.*, COUNT(*) OVER() FROM projects
      NATURAL JOIN reqs
      WHERE reqs.req_level > 5
      LIMIT {limit} OFFSET {offset}
    """).on(
      'limit -> PAGE_LIMIT,
      'offset -> (page-1) * PAGE_LIMIT
    ) 

    val list = r.list(simple)
    val count: Long = r.list(get[Long]("count")).headOption.getOrElse(0)

    (list, count)

  }

}

// GENERATED case class start
case class Project(
  id: Pk[Int] = NA,
  reqId: Int = 0,
  projectSourceId: String = "",
  name: String = "",
  amount: BigDecimal = 0,
  projectTypeId: Int = 0,
  scope: ProjectScope = ProjectScope.REPAIR,
  isFunded: Boolean = false,
  bidPrice: Option[BigDecimal] = None,
  projectContractId: Option[String] = None,
  contractCost: Option[BigDecimal] = None,
  contractStart: Option[Timestamp] = None,
  contractEnd: Option[Timestamp] = None
) extends ProjectCCGen with Entity[Project]
// GENERATED case class end
{
  lazy val req: Req = Req.findById(reqId).get

  def toJson: JsObject = Json.obj(
    "id" -> id,
    "name" -> name,
    "amount" -> amount,
    "scope" -> scope.name,
    "bidPrice" -> bidPrice,
    "reqId" -> reqId,
    "projectContractId" -> projectContractId,
    "contract" -> Json.obj(
      "cost" -> contractCost,
      "start" -> contractStart,
      "end" -> contractEnd
    )
  )
}
// GENERATED object start
trait ProjectGen extends EntityCompanion[Project] {
  val simple = {
    get[Pk[Int]]("project_id") ~
    get[Int]("req_id") ~
    get[String]("project_source_id") ~
    get[String]("project_name") ~
    get[java.math.BigDecimal]("project_amount") ~
    get[Int]("project_type_id") ~
    get[ProjectScope]("project_scope") ~
    get[Boolean]("project_funded") ~
    get[Option[BigDecimal]]("project_bid_price") ~
    get[Option[String]]("project_contract_id") ~
    get[Option[BigDecimal]]("project_contract_cost") ~
    get[Option[Timestamp]]("project_contract_start") ~
    get[Option[Timestamp]]("project_contract_end") map {
      case id~reqId~projectSourceId~name~amount~projectTypeId~scope~isFunded~bidPrice~projectContractId~contractCost~contractStart~contractEnd =>
        Project(id, reqId, projectSourceId, name, amount, projectTypeId, scope, isFunded, bidPrice, projectContractId, contractCost, contractStart, contractEnd)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from projects where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Project] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Project] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Project] = findOne("project_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Project] = DB.withConnection { implicit c =>
    SQL("select * from projects limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[Project] = DB.withConnection { implicit c =>
    SQL("select * from projects order by project_id").list(simple)
  }

  def insert(o: Project): Option[Project] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into projects (
            project_id,
            req_id,
            project_source_id,
            project_name,
            project_amount,
            project_type_id,
            project_scope,
            project_funded,
            project_bid_price,
            project_contract_id,
            project_contract_cost,
            project_contract_start,
            project_contract_end
          ) VALUES (
            DEFAULT,
            {reqId},
            {projectSourceId},
            {name},
            {amount},
            {projectTypeId},
            {scope},
            {isFunded},
            {bidPrice},
            {projectContractId},
            {contractCost},
            {contractStart},
            {contractEnd}
          )
        """).on(
          'id -> o.id,
          'reqId -> o.reqId,
          'projectSourceId -> o.projectSourceId,
          'name -> o.name,
          'amount -> o.amount.bigDecimal,
          'projectTypeId -> o.projectTypeId,
          'scope -> o.scope,
          'isFunded -> o.isFunded,
          'bidPrice -> o.bidPrice,
          'projectContractId -> o.projectContractId,
          'contractCost -> o.contractCost,
          'contractStart -> o.contractStart,
          'contractEnd -> o.contractEnd
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into projects (
            project_id,
            req_id,
            project_source_id,
            project_name,
            project_amount,
            project_type_id,
            project_scope,
            project_funded,
            project_bid_price,
            project_contract_id,
            project_contract_cost,
            project_contract_start,
            project_contract_end
          ) VALUES (
            {id},
            {reqId},
            {projectSourceId},
            {name},
            {amount},
            {projectTypeId},
            {scope},
            {isFunded},
            {bidPrice},
            {projectContractId},
            {contractCost},
            {contractStart},
            {contractEnd}
          )
        """).on(
          'id -> o.id,
          'reqId -> o.reqId,
          'projectSourceId -> o.projectSourceId,
          'name -> o.name,
          'amount -> o.amount.bigDecimal,
          'projectTypeId -> o.projectTypeId,
          'scope -> o.scope,
          'isFunded -> o.isFunded,
          'bidPrice -> o.bidPrice,
          'projectContractId -> o.projectContractId,
          'contractCost -> o.contractCost,
          'contractStart -> o.contractStart,
          'contractEnd -> o.contractEnd
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Project): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update projects set
        req_id={reqId},
        project_source_id={projectSourceId},
        project_name={name},
        project_amount={amount},
        project_type_id={projectTypeId},
        project_scope={scope},
        project_funded={isFunded},
        project_bid_price={bidPrice},
        project_contract_id={projectContractId},
        project_contract_cost={contractCost},
        project_contract_start={contractStart},
        project_contract_end={contractEnd}
      where project_id={id}
    """).on(
      'id -> o.id,
      'reqId -> o.reqId,
      'projectSourceId -> o.projectSourceId,
      'name -> o.name,
      'amount -> o.amount.bigDecimal,
      'projectTypeId -> o.projectTypeId,
      'scope -> o.scope,
      'isFunded -> o.isFunded,
      'bidPrice -> o.bidPrice,
      'projectContractId -> o.projectContractId,
      'contractCost -> o.contractCost,
      'contractStart -> o.contractStart,
      'contractEnd -> o.contractEnd
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from projects where project_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait ProjectCCGen {
  val companion = Project
}
// GENERATED object end

