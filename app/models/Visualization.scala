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
    case "landingPageData" => Some(getLandingPageData)
    case _ => None
  }}

  def getLandingPageData = DB.withConnection { implicit c =>
    SQL("""
      SELECT yolanda.count as yolanda_req_qty, yolanda.sum as yolanda_req_amt,
        bohol.count as bohol_req_qty, bohol.sum as bohol_req_amt,
        yolanda_projects.count as yolanda_project_qty,
        yolanda_projects.sum as yolanda_project_amt,
        bohol_projects.count as bohol_project_qty,
        bohol_projects.sum as bohol_project_amt,
        saro_yolanda.count as yolanda_saro_qty,
        saro_yolanda.sum as yolanda_saro_amt
      FROM (SELECT count(*), sum(req_amount)
        FROM reqs
        WHERE lower(req_disaster_name) like '%yolanda%'
        ) as yolanda,
        (SELECT count(*), sum(req_amount)
        FROM reqs
        WHERE lower(req_disaster_name) like '%bohol%'
        ) as bohol,
        (SELECT count(*), sum(project_amount)
        FROM projects
        LEFT JOIN reqs on projects.req_id = reqs.req_id
        WHERE lower(req_disaster_name) like '%yolanda%') as yolanda_projects,
        (SELECT count(*), sum(project_amount)
        FROM projects
        LEFT JOIN reqs on projects.req_id = reqs.req_id
        WHERE lower(req_disaster_name) like '%bohol%') as bohol_projects,
        (SELECT count(*), sum(amount) FROM saro_bureau_g) as saro_yolanda
      """).single(
      get[Long]("yolanda_req_qty") ~
      get[java.math.BigDecimal]("yolanda_req_amt") ~
      get[Long]("yolanda_project_qty") ~
      get[java.math.BigDecimal]("yolanda_project_amt") ~
      get[Long]("bohol_req_qty") ~
      get[java.math.BigDecimal]("bohol_req_amt") ~
      get[Long]("bohol_project_qty") ~
      get[java.math.BigDecimal]("bohol_project_amt") ~
      get[Long]("yolanda_saro_qty") ~
      get[java.math.BigDecimal]("yolanda_saro_amt") map {
        case yolanda_req_qty ~ yolanda_req_amt ~ 
          yolanda_project_qty ~ yolanda_project_amt ~ 
          bohol_req_qty ~ bohol_req_amt ~ 
          bohol_project_qty ~ bohol_project_amt ~ 
          yolanda_saro_qty ~ yolanda_saro_amt => {
          Json.obj(
            "yolanda_req_qty" -> yolanda_req_qty,
            "yolanda_req_amt" -> BigDecimal(yolanda_req_amt),
            "bohol_req_qty" -> bohol_req_qty,
            "bohol_req_amt" -> BigDecimal(bohol_req_amt),
            "yolanda_project_qty" -> yolanda_project_qty,
            "yolanda_project_amt" -> BigDecimal(yolanda_project_amt),
            "bohol_project_qty" -> bohol_project_qty,
            "bohol_project_amt" -> BigDecimal(bohol_project_amt),
            "yolanda_saro_qty" -> yolanda_saro_qty,
            "yolanda_saro_amt" -> BigDecimal(yolanda_saro_amt)
          )
        }
      }
    )
  }

  def getDBMBureauGData = DB.withConnection { implicit c =>
    SQL("SELECT * FROM saro_bureau_g").list(
      get[Option[String]]("agency") ~
      get[Option[String]]("saro_number") ~
      get[Option[Timestamp]]("saro_date") ~
      get[Option[Int]]("year") ~
      get[Option[java.math.BigDecimal]]("amount") ~
      get[Option[Int]]("project_quantity") ~
      get[Option[String]]("remarks") map {
        case agency~saro_number~date~year~amount~quantity~remarks => {
          Json.obj(
            "agency" -> agency,
            "saro_number" -> saro_number,
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
      get[Option[String]]("project_id") ~
      get[Option[String]]("project_description") ~
      get[Option[String]]("contract_id") ~
      get[Option[String]]("contract_desc") ~
      get[Option[java.math.BigDecimal]]("contract_cost") ~
      get[Option[java.math.BigDecimal]]("project_cost") ~
      get[Option[String]]("contract_start_date") ~
      get[Option[String]]("contract_end_date") ~
      get[Option[Int]]("contract_duration") ~
      get[Option[Int]]("gaa_id") ~
      get[Option[Int]]("budget_year") ~
      get[Option[String]]("fs_type") ~
      get[Option[String]]("fs_tname") ~
      get[Option[String]]("fund_code") ~
      get[Option[String]]("inst_name") ~
      get[Option[String]]("inst_code") ~
      get[Option[String]]("loan_number") ~
      get[Option[Int]]("loan_package") ~
      get[Option[Int]]("loan_sub_package") ~
      get[Option[Int]]("pms_inauguration") ~
      get[Option[java.math.BigDecimal]]("const_budget") ~
      get[Option[String]]("project_location") ~
      get[Option[String]]("scope") ~
      get[Option[String]]("physical_type_tag") ~
      get[Option[java.math.BigDecimal]]("physical") ~
      get[Option[String]]("unit_desc") ~
      get[Option[String]]("office_id") ~
      get[Option[String]]("region") ~
      get[Option[String]]("implementing_office") ~
      get[Option[String]]("project_engineer") ~
      get[Option[String]]("project_contractor") ~
      get[Option[String]]("project_proponent") ~
      get[Option[String]]("project_consultant") ~
      get[Option[Timestamp]]("notice_to_proceed") ~
      get[Option[java.math.BigDecimal]]("project_abc") ~
      get[Option[java.math.BigDecimal]]("bid_price") ~
      get[Option[Int]]("number_of_bidder") ~
      get[Option[Int]]("actual_start_year") ~
      get[Option[Int]]("actual_start_month") ~
      get[Option[java.math.BigDecimal]]("actual_percentage_started") ~
      get[Option[Int]]("actual_completion_year") ~
      get[Option[Int]]("actual_completion_month") ~
      get[Option[java.math.BigDecimal]]("actual_percentage_completed") ~
      get[Option[java.math.BigDecimal]]("completed_amount") ~
      get[Option[String]]("implementation_mode") ~
      get[Option[Int]]("irr_pk") ~
      get[Option[String]]("irr_description") ~
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
      get[Option[String]]("activity_12") ~
      get[Option[Timestamp]]("activity_12_start_date") ~
      get[Option[Timestamp]]("activity_12_end_date") ~
      get[Option[String]]("activity_13") ~
      get[Option[Timestamp]]("activity_13_start_date") ~
      get[Option[Timestamp]]("activity_13_end_date") ~
      get[Option[String]]("activity_14") ~
      get[Option[Timestamp]]("activity_14_start_date") ~
      get[Option[Timestamp]]("activity_14_end_date") ~
      get[Option[String]]("activity_15") ~
      get[Option[Timestamp]]("activity_15_start_date") ~
      get[Option[Timestamp]]("activity_15_end_date") ~
      get[Option[String]]("activity_16") ~
      get[Option[Timestamp]]("activity_16_start_date") ~
      get[Option[Timestamp]]("activity_16_end_date") ~
      get[Option[String]]("activity_17") ~
      get[Option[Timestamp]]("activity_17_start_date") ~
      get[Option[Timestamp]]("activity_17_end_date") ~
      get[Option[String]]("activity_18") ~
      get[Option[Timestamp]]("activity_18_start_date") ~
      get[Option[Timestamp]]("activity_18_end_date") ~
      get[Option[String]]("activity_19") ~
      get[Option[Timestamp]]("activity_19_start_date") ~
      get[Option[Timestamp]]("activity_19_end_date") ~
      get[Option[String]]("activity_20") ~
      get[Option[Timestamp]]("activity_20_start_date") ~
      get[Option[Timestamp]]("activity_20_end_date") ~
      get[Option[String]]("activity_21") ~
      get[Option[Timestamp]]("activity_21_start_date") ~
      get[Option[Timestamp]]("activity_21_end_date") ~
      get[Option[String]]("activity_22") ~
      get[Option[Timestamp]]("activity_22_start_date") ~
      get[Option[Timestamp]]("activity_22_end_date") ~
      get[Option[String]]("activity_23") ~
      get[Option[Timestamp]]("activity_23_start_date") ~
      get[Option[Timestamp]]("activity_23_end_date") ~
      get[Option[String]]("activity_24") ~
      get[Option[Timestamp]]("activity_24_start_date") ~
      get[Option[Timestamp]]("activity_24_end_date") ~
      get[Option[String]]("activity_25") ~
      get[Option[Timestamp]]("activity_25_start_date") ~
      get[Option[Timestamp]]("activity_25_end_date") ~
      get[Option[String]]("activity_26") ~
      get[Option[Timestamp]]("activity_26_start_date") ~
      get[Option[Timestamp]]("activity_26_end_date") ~
      get[Option[String]]("activity_27") ~
      get[Option[Timestamp]]("activity_27_start_date") ~
      get[Option[Timestamp]]("activity_27_end_date") ~
      get[Option[String]]("activity_28") ~
      get[Option[Timestamp]]("activity_28_start_date") ~
      get[Option[Timestamp]]("activity_28_end_date") ~
      get[Option[String]]("activity_29") ~
      get[Option[Timestamp]]("activity_29_start_date") ~
      get[Option[Timestamp]]("activity_29_end_date") ~
      get[Option[String]]("activity_30") ~
      get[Option[Timestamp]]("activity_30_start_date") ~
      get[Option[Timestamp]]("activity_30_end_date") ~
      get[Option[String]]("project_type") ~
      get[Option[Int]]("months_of_completion") ~
      get[Option[String]]("disaster") ~
      get[Option[String]]("psgc") ~
      get[Option[String]]("SAA_number") ~
      get[Option[String]]("saro_abm_number") ~
      get[Option[java.math.BigDecimal]]("financial_allotment") ~
      get[Option[java.math.BigDecimal]]("financial_obligation") ~
      get[Option[java.math.BigDecimal]]("financial_disbursement") ~
      get[Option[java.math.BigDecimal]]("physical_planned") ~
      get[Option[java.math.BigDecimal]]("physical_revised") ~
      get[Option[java.math.BigDecimal]]("physical_actual") ~
      get[Option[java.math.BigDecimal]]("physical_slippage") ~
      get[Option[java.math.BigDecimal]]("physical_performance_index") map { case project_id~
      project_description~
      contract_id~
      contract_desc~
      contract_cost~
      project_cost~
      contract_start_date~
      contract_end_date~
      contract_duration~
      gaa_id~
      budget_year~
      fs_type~
      fs_tname~
      fund_code~
      inst_name~
      inst_code~
      loan_number~
      loan_package~
      loan_sub_package~
      pms_inauguration~
      const_budget~
      project_location~
      scope~
      physical_type_tag~
      physical~
      unit_desc~
      office_id~
      region~
      implementing_office~
      project_engineer~
      project_contractor~
      project_proponent~
      project_consultant~
      notice_to_proceed~
      project_abc~
      bid_price~
      number_of_bidder~
      actual_start_year~
      actual_start_month~
      actual_percentage_started~
      actual_completion_year~
      actual_completion_month~
      actual_percentage_completed~
      completed_amount~
      implementation_mode~
      irr_pk~
      irr_description~
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
      activity_12~
      activity_12_start_date~
      activity_12_end_date~
      activity_13~
      activity_13_start_date~
      activity_13_end_date~
      activity_14~
      activity_14_start_date~
      activity_14_end_date~
      activity_15~
      activity_15_start_date~
      activity_15_end_date~
      activity_16~
      activity_16_start_date~
      activity_16_end_date~
      activity_17~
      activity_17_start_date~
      activity_17_end_date~
      activity_18~
      activity_18_start_date~
      activity_18_end_date~
      activity_19~
      activity_19_start_date~
      activity_19_end_date~
      activity_20~
      activity_20_start_date~
      activity_20_end_date~
      activity_21~
      activity_21_start_date~
      activity_21_end_date~
      activity_22~
      activity_22_start_date~
      activity_22_end_date~
      activity_23~
      activity_23_start_date~
      activity_23_end_date~
      activity_24~
      activity_24_start_date~
      activity_24_end_date~
      activity_25~
      activity_25_start_date~
      activity_25_end_date~
      activity_26~
      activity_26_start_date~
      activity_26_end_date~
      activity_27~
      activity_27_start_date~
      activity_27_end_date~
      activity_28~
      activity_28_start_date~
      activity_28_end_date~
      activity_29~
      activity_29_start_date~
      activity_29_end_date~
      activity_30~
      activity_30_start_date~
      activity_30_end_date~
      project_type~
      months_of_completion~
      disaster~
      psgc~
      saa_number~
      saro_abm_number~
      financial_allotment~
      financial_obligation~
      financial_disbursement~
      physical_planned~
      physical_revised~
      physical_actual~
      physical_slippage~
      physical_performance_index => Json.obj(
        "project_id" -> project_id,
        "project_description" -> project_description,
        "contract_id" -> contract_id,
        "contract_desc" -> contract_desc,
        "contract_cost" -> contract_cost.map(v => BigDecimal(v)),
        "project_cost" -> project_cost.map(v => BigDecimal(v)),
        "contract_start_date" -> contract_start_date,
        "contract_end_date" -> contract_end_date,
        "contract_duration" -> contract_duration,
        "gaa_id" -> gaa_id,
        "budget_year" -> budget_year,
        "fs_type" -> fs_type,
        "fs_tname" -> fs_tname,
        "fund_code" -> fund_code,
        "inst_name" -> inst_name,
        "inst_code" -> inst_code,
        "loan_number" -> loan_number,
        "loan_package" -> loan_package,
        "loan_sub_package" -> loan_sub_package,
        "pms_inauguration" -> pms_inauguration,
        "const_budget" -> const_budget.map(v => BigDecimal(v)),
        "project_location" -> project_location,
        "scope" -> scope,
        "physical_type_tag" -> physical_type_tag,
        "physical" -> physical.map(v => BigDecimal(v)),
        "unit_desc" -> unit_desc,
        "office_id" -> office_id,
        "region" -> region,
        "implementing_office" -> implementing_office,
        "project_engineer" -> project_engineer,
        "project_contractor" -> project_contractor,
        "project_proponent" -> project_proponent,
        "project_consultant" -> project_consultant,
        "notice_to_proceed" -> notice_to_proceed,
        "project_abc" -> project_abc.map(v => BigDecimal(v)),
        "bid_price" -> bid_price.map(v => BigDecimal(v)),
        "number_of_bidder" -> number_of_bidder,
        "actual_start_year" -> actual_start_year,
        "actual_start_month" -> actual_start_month,
        "actual_percentage_started" -> actual_percentage_started.map(v => BigDecimal(v)),
        "actual_completion_year" -> actual_completion_year,
        "actual_completion_month" -> actual_completion_month,
        "actual_percentage_completed" -> actual_percentage_completed.map(v => BigDecimal(v)),
        "completed_amount" -> completed_amount.map(v => BigDecimal(v)),
        "implementation_mode" -> implementation_mode,
        "irr_pk" -> irr_pk,
        "irr_description" -> irr_description,
        "activity_1" -> activity_1,
        "activity_1_start_date" -> activity_1_start_date,
        "activity_1_end_date" -> activity_1_end_date,
        "activity_2" -> activity_2,
        "activity_2_start_date" -> activity_2_start_date,
        "activity_2_end_date" -> activity_2_end_date,
        "activity_3" -> activity_3,
        "activity_3_start_date" -> activity_3_start_date,
        "activity_3_end_date" -> activity_3_end_date,
        "activity_4" -> activity_4,
        "activity_4_start_date" -> activity_4_start_date,
        "activity_4_end_date" -> activity_4_end_date,
        "activity_5" -> activity_5,
        "activity_5_start_date" -> activity_5_start_date,
        "activity_5_end_date" -> activity_5_end_date,
        "activity_6" -> activity_6,
        "activity_6_start_date" -> activity_6_start_date,
        "activity_6_end_date" -> activity_6_end_date,
        "activity_7" -> activity_7,
        "activity_7_start_date" -> activity_7_start_date,
        "activity_7_end_date" -> activity_7_end_date,
        "activity_8" -> activity_8,
        "activity_8_start_date" -> activity_8_start_date,
        "activity_8_end_date" -> activity_8_end_date,
        "activity_9" -> activity_9,
        "activity_9_start_date" -> activity_9_start_date,
        "activity_9_end_date" -> activity_9_end_date,
        "activity_10" -> activity_10,
        "activity_10_start_date" -> activity_10_start_date,
        "activity_10_end_date" -> activity_10_end_date,
        "activity_11" -> activity_11,
        "activity_11_start_date" -> activity_11_start_date,
        "activity_11_end_date" -> activity_11_end_date,
        "activity_12" -> activity_12,
        "activity_12_start_date" -> activity_12_start_date,
        "activity_12_end_date" -> activity_12_end_date,
        "activity_13" -> activity_13,
        "activity_13_start_date" -> activity_13_start_date,
        "activity_13_end_date" -> activity_13_end_date,
        "activity_14" -> activity_14,
        "activity_14_start_date" -> activity_14_start_date,
        "activity_14_end_date" -> activity_14_end_date,
        "activity_15" -> activity_15,
        "activity_15_start_date" -> activity_15_start_date,
        "activity_15_end_date" -> activity_15_end_date,
        "activity_16" -> activity_16,
        "activity_16_start_date" -> activity_16_start_date,
        "activity_16_end_date" -> activity_16_end_date,
        "activity_17" -> activity_17,
        "activity_17_start_date" -> activity_17_start_date,
        "activity_17_end_date" -> activity_17_end_date,
        "activity_18" -> activity_18,
        "activity_18_start_date" -> activity_18_start_date,
        "activity_18_end_date" -> activity_18_end_date,
        "activity_19" -> activity_19,
        "activity_19_start_date" -> activity_19_start_date,
        "activity_19_end_date" -> activity_19_end_date,
        "activity_20" -> activity_20,
        "activity_20_start_date" -> activity_20_start_date,
        "activity_20_end_date" -> activity_20_end_date,
        "activity_21" -> activity_21,
        "activity_21_start_date" -> activity_21_start_date,
        "activity_21_end_date" -> activity_21_end_date,
        "activity_22" -> activity_22,
        "activity_22_start_date" -> activity_22_start_date,
        "activity_22_end_date" -> activity_22_end_date,
        "activity_23" -> activity_23,
        "activity_23_start_date" -> activity_23_start_date,
        "activity_23_end_date" -> activity_23_end_date,
        "activity_24" -> activity_24,
        "activity_24_start_date" -> activity_24_start_date,
        "activity_24_end_date" -> activity_24_end_date,
        "activity_25" -> activity_25,
        "activity_25_start_date" -> activity_25_start_date,
        "activity_25_end_date" -> activity_25_end_date,
        "activity_26" -> activity_26,
        "activity_26_start_date" -> activity_26_start_date,
        "activity_26_end_date" -> activity_26_end_date,
        "activity_27" -> activity_27,
        "activity_27_start_date" -> activity_27_start_date,
        "activity_27_end_date" -> activity_27_end_date,
        "activity_28" -> activity_28,
        "activity_28_start_date" -> activity_28_start_date,
        "activity_28_end_date" -> activity_28_end_date,
        "activity_29" -> activity_29,
        "activity_29_start_date" -> activity_29_start_date,
        "activity_29_end_date" -> activity_29_end_date,
        "activity_30" -> activity_30,
        "activity_30_start_date" -> activity_30_start_date,
        "activity_30_end_date" -> activity_30_end_date,
        "project_type" -> project_type,
        "months_of_completion" -> months_of_completion,
        "disaster" -> disaster,
        "psgc" -> psgc,
        "SAA_number" -> saa_number,
        "saro_abm_number" -> saro_abm_number,
        "financial_allotment" -> financial_allotment.map(v => BigDecimal(v)),
        "financial_obligation" -> financial_obligation.map(v => BigDecimal(v)),
        "financial_disbursement" -> financial_disbursement.map(v => BigDecimal(v)),
        "physical_planned" -> physical_planned.map(v => BigDecimal(v)),
        "physical_revised" -> physical_revised.map(v => BigDecimal(v)),
        "physical_actual" -> physical_actual.map(v => BigDecimal(v)),
        "physical_slippage" -> physical_slippage.map(v => BigDecimal(v)),
        "physical_performance_index" -> physical_performance_index.map(v => BigDecimal(v))
      )
    })
  }

}