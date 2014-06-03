package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.{Date, Timestamp}
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Visualization {

  def getData(v: String) = { v match {
    case "EPLC" => Some(Json.toJson(getEPLCData))
    case "DBMBureauG" => Some(Json.toJson(getDBMBureauGData))
    case "landing" => getLanding
    case _ => None
  }}

  def getLanding = DB.withConnection { implicit c =>
    SQL("""
      SELECT yolanda.count as yolanda_req_qty, yolanda.sum as yolanda_req_amt,
        bohol.count as bohol_req_qty, bohol.sum as bohol_req_amt,
        yolanda_projects_all.count as yolanda_project_qty,
        yolanda_projects_all.sum as yolanda_project_amt,
        bohol_projects_all.count as bohol_project_qty,
        bohol_projects_all.sum as bohol_project_amt,
        saro_yolanda.count as yolanda_saro_qty,
        saro_yolanda.sum as yolanda_saro_amt,
        yolanda_projects_funded.count as yolanda_project_funded_qty,
        yolanda_projects_funded.sum as yolanda_project_funded_amt,
        bohol_projects_funded.count as bohol_project_funded_qty,
        bohol_projects_funded.sum as bohol_project_funded_amt
      FROM (SELECT count(*), sum(req_amount)
        FROM reqs
        WHERE lower(req_disaster_name) like '%yolanda%'
        ) as yolanda,
        (SELECT count(*), sum(req_amount)
        FROM reqs
        WHERE lower(req_disaster_name) like '%bohol%'
        ) as bohol,
        (SELECT count(*), coalesce(sum(project_amount),0) as sum
        FROM projects
        LEFT JOIN reqs on projects.req_id = reqs.req_id
        WHERE lower(req_disaster_name) like '%yolanda%') as yolanda_projects_all,
        (SELECT count(*), coalesce(sum(project_amount),0) as sum
        FROM projects
        LEFT JOIN reqs on projects.req_id = reqs.req_id
        WHERE lower(req_disaster_name) like '%yolanda%'
        AND project_funded) as yolanda_projects_funded,
        (SELECT count(*), coalesce(sum(project_amount),0) as sum
        FROM projects
        LEFT JOIN reqs on projects.req_id = reqs.req_id
        WHERE lower(req_disaster_name) like '%bohol%') as bohol_projects_all,
        (SELECT count(*), coalesce(sum(project_amount),0) as sum
        FROM projects
        LEFT JOIN reqs on projects.req_id = reqs.req_id
        WHERE lower(req_disaster_name) like '%bohol%'
        AND project_funded) as bohol_projects_funded,
        (SELECT count(*), sum(amount) FROM saro_bureau_g) as saro_yolanda
      """).singleOpt(
      get[Long]("yolanda_req_qty") ~
      get[java.math.BigDecimal]("yolanda_req_amt") ~
      get[Long]("yolanda_project_qty") ~
      get[java.math.BigDecimal]("yolanda_project_amt") ~
      get[Long]("bohol_req_qty") ~
      get[java.math.BigDecimal]("bohol_req_amt") ~
      get[Long]("bohol_project_qty") ~
      get[java.math.BigDecimal]("bohol_project_amt") ~
      get[Long]("yolanda_saro_qty") ~
      get[java.math.BigDecimal]("yolanda_saro_amt") ~
      get[Long]("yolanda_project_funded_qty") ~
      get[java.math.BigDecimal]("yolanda_project_funded_amt") ~
      get[Long]("bohol_project_funded_qty") ~
      get[java.math.BigDecimal]("bohol_project_funded_amt") map {
        case yolanda_req_qty ~ yolanda_req_amt ~ 
          yolanda_project_qty ~ yolanda_project_amt ~ 
          bohol_req_qty ~ bohol_req_amt ~ 
          bohol_project_qty ~ bohol_project_amt ~ 
          yolanda_saro_qty ~ yolanda_saro_amt ~
          yolanda_project_funded_qty ~ yolanda_project_funded_amt ~ 
          bohol_project_funded_qty ~ bohol_project_funded_amt => {

          def qtyAmt(qty: Long, amt: java.math.BigDecimal) = Json.obj(
            "qty" -> qty,
            "amt" -> BigDecimal(amt)
          )

          Json.obj(
            "yolanda" -> Json.obj(
              "req" -> qtyAmt(yolanda_req_qty, yolanda_req_amt),
              "saro" -> qtyAmt(yolanda_saro_qty, yolanda_saro_amt),
              "projects" -> qtyAmt(yolanda_project_qty, yolanda_project_amt),
              "fundedProjects" -> qtyAmt(yolanda_project_funded_qty, yolanda_project_funded_amt)
            ),
            "bohol" -> Json.obj(
              "req" -> qtyAmt(bohol_req_qty, bohol_req_amt),
              "projects" -> qtyAmt(bohol_project_qty, bohol_project_amt),
              "fundedProjects" -> qtyAmt(bohol_project_funded_qty, bohol_project_funded_amt)
            )
          )

        }
      }
    )
  }

  def getDBMBureauGData = DB.withConnection { implicit c =>
    SQL("SELECT * FROM saro_bureau_g").list(
      get[Option[String]]("agency") ~
      get[Option[Timestamp]]("saro_date") ~
      get[Option[Int]]("year") ~
      get[Option[java.math.BigDecimal]]("amount") ~
      get[Option[Int]]("project_quantity") ~
      get[Option[String]]("remarks") map {
        case agency~date~year~amount~quantity~remarks => {
          Json.obj(
            "agency" -> agency,
            "saro_date" -> date,
            "year" -> year,
            "amount" -> amount.map(v => BigDecimal(v)),
            "project_quantity" -> quantity,
            "remarks" -> remarks
          )
        }
      }
    )
  }

  private def getEPLCData = DB.withConnection { implicit c =>
    SQL("SELECT * FROM dpwh_eplc").list(
      get[Option[String]]("contract_start_date") ~
      get[Option[String]]("contract_end_date") ~
      get[Option[Int]]("contract_duration") ~
      get[Option[java.math.BigDecimal]]("project_abc") ~
      get[Option[String]]("activity_1") ~
      get[Option[Timestamp]]("activity_1_start_date") ~
      get[Option[Timestamp]]("activity_1_end_date") ~
      get[Option[String]]("activity_2") ~
      get[Option[Timestamp]]("activity_2_start_date") ~
      get[Option[Timestamp]]("activity_2_end_date") ~
      get[Option[String]]("activity_3") ~
      get[Option[Timestamp]]("activity_3_start_date") ~
      get[Option[Timestamp]]("activity_3_end_date") ~
      get[Option[String]]("activity_4") ~
      get[Option[Timestamp]]("activity_4_start_date") ~
      get[Option[Timestamp]]("activity_4_end_date") ~
      get[Option[String]]("activity_5") ~
      get[Option[Timestamp]]("activity_5_start_date") ~
      get[Option[Timestamp]]("activity_5_end_date") ~
      get[Option[String]]("activity_6") ~
      get[Option[Timestamp]]("activity_6_start_date") ~
      get[Option[Timestamp]]("activity_6_end_date") ~
      get[Option[String]]("activity_7") ~
      get[Option[Timestamp]]("activity_7_start_date") ~
      get[Option[Timestamp]]("activity_7_end_date") ~
      get[Option[String]]("activity_8") ~
      get[Option[Timestamp]]("activity_8_start_date") ~
      get[Option[Timestamp]]("activity_8_end_date") ~
      get[Option[String]]("activity_9") ~
      get[Option[Timestamp]]("activity_9_start_date") ~
      get[Option[Timestamp]]("activity_9_end_date") ~
      get[Option[String]]("activity_10") ~
      get[Option[String]]("activity_10_start_date") ~
      get[Option[Timestamp]]("activity_10_end_date") ~
      get[Option[String]]("activity_11") ~
      get[Option[Timestamp]]("activity_11_start_date") ~
      get[Option[Timestamp]]("activity_11_end_date") ~
      get[Option[String]]("project_type") ~
      get[Option[Int]]("months_of_completion") ~
      get[Option[String]]("disaster") map { case contract_start_date~
      contract_end_date~
      contract_duration~
      project_abc~
      activity_1~
      activity_1_start_date~
      activity_1_end_date~
      activity_2~
      activity_2_start_date~
      activity_2_end_date~
      activity_3~
      activity_3_start_date~
      activity_3_end_date~
      activity_4~
      activity_4_start_date~
      activity_4_end_date~
      activity_5~
      activity_5_start_date~
      activity_5_end_date~
      activity_6~
      activity_6_start_date~
      activity_6_end_date~
      activity_7~
      activity_7_start_date~
      activity_7_end_date~
      activity_8~
      activity_8_start_date~
      activity_8_end_date~
      activity_9~
      activity_9_start_date~
      activity_9_end_date~
      activity_10~
      activity_10_start_date~
      activity_10_end_date~
      activity_11~
      activity_11_start_date~
      activity_11_end_date~
      project_type~
      months_of_completion~
      disaster => Json.obj(
        "contract_start_date" -> contract_start_date,
        "contract_end_date" -> contract_end_date,
        "contract_duration" -> contract_duration,
        "project_abc" -> project_abc.map(v => BigDecimal(v)),
        "activities" -> Json.arr(
          Json.obj("name" -> activity_1,
          "start_date" -> activity_1_start_date,
          "end_date" -> activity_1_end_date),
          Json.obj("name" -> activity_2,
          "start_date" -> activity_2_start_date,
          "end_date" -> activity_2_end_date),
          Json.obj("name" -> activity_3,
          "start_date" -> activity_3_start_date,
          "end_date" -> activity_3_end_date),
          Json.obj("name" -> activity_4,
          "start_date" -> activity_4_start_date,
          "end_date" -> activity_4_end_date),
          Json.obj("name" -> activity_5,
          "start_date" -> activity_5_start_date,
          "end_date" -> activity_5_end_date),
          Json.obj("name" -> activity_6,
          "start_date" -> activity_6_start_date,
          "end_date" -> activity_6_end_date),
          Json.obj("name" -> activity_7,
          "start_date" -> activity_7_start_date,
          "end_date" -> activity_7_end_date),
          Json.obj("name" -> activity_8,
          "start_date" -> activity_8_start_date,
          "end_date" -> activity_8_end_date),
          Json.obj("name" -> activity_9,
          "start_date" -> activity_9_start_date,
          "end_date" -> activity_9_end_date),
          Json.obj("name" -> activity_10,
          "start_date" -> activity_10_start_date,
          "end_date" -> activity_10_end_date),
          Json.obj("name" -> activity_11,
          "start_date" -> activity_11_start_date,
          "end_date" -> activity_11_end_date)
        ),
        "project_type" -> project_type,
        "months_of_completion" -> months_of_completion,
        "disaster" -> disaster
      )
    })
  }

}