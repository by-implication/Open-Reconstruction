/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.{Date, Timestamp}
import java.util.Calendar
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._
import scala.language.existentials

object Visualization {

  def getData(v: String) = { v match {
    case "EPLC" => Some(getEPLCData)
    case "DBMBureauG" => Some(Json.toJson(getDBMBureauGData))
    case "landing" => getLanding
    case _ => None
  }}

  def getLanding = DB.withConnection { implicit c =>

    def disasterProjects(disasterName: String): Seq[(Long, BigDecimal)] = {
      SQL("""
        SELECT project_funded, count(*), coalesce(sum(project_amount),0) as sum
        FROM projects LEFT JOIN reqs on projects.req_id = reqs.req_id NATURAL JOIN disasters
        WHERE disaster_name = {disasterName}
        GROUP BY project_funded ORDER BY project_funded ASC
      """).on('disasterName -> disasterName).list(
        get[Long]("count") ~
        get[java.math.BigDecimal]("sum") map {
          case count~sum => (count, BigDecimal(sum))
        }
      )
    }

    def requestLocations(): Seq[(Long, BigDecimal, BigDecimal)] = {
      SQL("""
        SELECT COUNT(*), req_location, lgu_lat, lgu_lng FROM reqs
        LEFT JOIN lgus ON reqs.gov_unit_id = lgus.lgu_id
        GROUP BY reqs.req_location, lgu_lat, lgu_lng
        ORDER BY req_location
      """)list(
        get[Long]("count") ~
        get[String]("req_location") ~
        get[Option[BigDecimal]]("lgu_lat") ~
        get[Option[BigDecimal]]("lgu_lng") map {
          case count~location~lat~lng => {
            (lat, lng) match {
              case (Some(lat), Some(lng)) => (count, lat, lng)
              case _ => {
                try {
                  val psgc = location.toInt
                  (count, Lgu.regionCoords(psgc)._1, Lgu.regionCoords(psgc)._2)
                } catch {
                  case e:Exception => {
                    (count, Lgu.COUNTRY_COORDS._1, Lgu.COUNTRY_COORDS._2)
                  }
                }
              }
            }
          }
        }
      )


    }

    SQL("""
      SELECT yolanda.count as yolanda_req_qty, yolanda.sum as yolanda_req_amt,
        bohol.count as bohol_req_qty, bohol.sum as bohol_req_amt,
        saro_yolanda.count as yolanda_saro_qty,
        saro_yolanda.sum as yolanda_saro_amt,
        saro_bohol.count as bohol_saro_qty,
        saro_bohol.sum as bohol_saro_amt,
        saro_yolanda_dpwh.count as yolanda_dpwh_saro_qty,
        saro_yolanda_dpwh.sum as yolanda_dpwh_saro_amt,
        saro_bohol_dpwh.count as bohol_dpwh_saro_qty,
        saro_bohol_dpwh.sum as bohol_dpwh_saro_amt,
        saro_yolanda_dilg.count as yolanda_dilg_saro_qty,
        saro_yolanda_dilg.sum as yolanda_dilg_saro_amt,
        saro_bohol_dilg.count as bohol_dilg_saro_qty,
        saro_bohol_dilg.sum as bohol_dilg_saro_amt
      FROM (
        SELECT count(*), sum(req_amount)
        FROM reqs NATURAL JOIN disasters
        WHERE disaster_name = 'Typhoon Yolanda'
      ) as yolanda,
      (
        SELECT count(*), sum(req_amount)
        FROM reqs NATURAL JOIN disasters
        WHERE disaster_name = 'Bohol Earthquake'
      ) as bohol,
      (
        SELECT count(*), sum(amount) FROM saro_bureau_g
        WHERE disaster ILIKE '%yolanda%'
      ) as saro_yolanda,
      (
        SELECT count(*), sum(amount) FROM saro_bureau_g
        WHERE disaster ILIKE '%bohol%'
      ) as saro_bohol,
      (
        SELECT count(*), sum(amount) FROM saro_bureau_g
        WHERE disaster ILIKE '%yolanda%'
        AND agency ILIKE 'DPWH'
      ) as saro_yolanda_dpwh,
      (
        SELECT count(*), sum(amount) FROM saro_bureau_g
        WHERE disaster ILIKE '%bohol%'
        AND agency ILIKE 'DPWH'
      ) as saro_bohol_dpwh,
      (
        SELECT count(*), sum(amount) FROM saro_bureau_g
        WHERE disaster ILIKE '%yolanda%'
        AND agency ILIKE 'DILG'
      ) as saro_yolanda_dilg,
      (
        SELECT count(*), sum(amount) FROM saro_bureau_g
        WHERE disaster ILIKE '%bohol%'
        AND agency ILIKE 'DILG'
      ) as saro_bohol_dilg
    """).singleOpt(
      get[Long]("yolanda_req_qty") ~
      get[java.math.BigDecimal]("yolanda_req_amt") ~
      get[Long]("bohol_req_qty") ~
      get[java.math.BigDecimal]("bohol_req_amt") ~
      get[Long]("yolanda_saro_qty") ~
      get[java.math.BigDecimal]("yolanda_saro_amt") ~
      get[Long]("bohol_saro_qty") ~
      get[java.math.BigDecimal]("bohol_saro_amt") ~
      get[Long]("yolanda_dpwh_saro_qty") ~
      get[java.math.BigDecimal]("yolanda_dpwh_saro_amt") ~
      get[Long]("bohol_dpwh_saro_qty") ~
      get[java.math.BigDecimal]("bohol_dpwh_saro_amt") ~
      get[Long]("yolanda_dilg_saro_qty") ~
      get[java.math.BigDecimal]("yolanda_dilg_saro_amt") ~
      get[Long]("bohol_dilg_saro_qty") ~
      get[java.math.BigDecimal]("bohol_dilg_saro_amt") map {

        case yolanda_req_qty ~ yolanda_req_amt ~
          bohol_req_qty ~ bohol_req_amt ~
          yolanda_saro_qty ~ yolanda_saro_amt ~
          bohol_saro_qty ~ bohol_saro_amt ~
          yolanda_dpwh_saro_qty ~ yolanda_dpwh_saro_amt ~
          bohol_dpwh_saro_qty ~ bohol_dpwh_saro_amt ~
          yolanda_dilg_saro_qty ~ yolanda_dilg_saro_amt ~
          bohol_dilg_saro_qty ~ bohol_dilg_saro_amt => {

          val List(bohol_unfunded, bohol_funded) = disasterProjects("Bohol Earthquake")
          val List(yolanda_unfunded, yolanda_funded) = disasterProjects("Typhoon Yolanda")

          def qtyAmt(qty: Long, amt: BigDecimal) = Json.obj(
            "qty" -> qty,
            "amt" -> amt
          )

          Json.obj(
            "yolanda" -> Json.obj(
              "req" -> qtyAmt(yolanda_req_qty, yolanda_req_amt),
              "saro" -> qtyAmt(yolanda_saro_qty, yolanda_saro_amt),
              "projects" -> qtyAmt(
                yolanda_unfunded._1 + yolanda_funded._1,
                yolanda_unfunded._2 + yolanda_funded._2
              ),
              "fundedProjects" -> (qtyAmt _ tupled yolanda_funded),
              "dpwh" -> qtyAmt(yolanda_dpwh_saro_qty, yolanda_dpwh_saro_amt),
              "dilg" -> qtyAmt(yolanda_dilg_saro_qty, yolanda_dilg_saro_amt)
            ),
            "bohol" -> Json.obj(
              "req" -> qtyAmt(bohol_req_qty, bohol_req_amt),
              "saro" -> qtyAmt(bohol_saro_qty, bohol_saro_amt),
              "projects" -> qtyAmt(
                bohol_unfunded._1 + bohol_funded._1,
                bohol_unfunded._2 + bohol_funded._2
              ),
              "fundedProjects" -> (qtyAmt _ tupled bohol_funded),
              "dpwh" -> qtyAmt(bohol_dpwh_saro_qty, bohol_dpwh_saro_amt),
              "dilg" -> qtyAmt(bohol_dilg_saro_qty, bohol_dilg_saro_amt)
            ),
            "requests" -> Json.toJson(
              requestLocations().map { case (count, lat, lng) =>
              Json.obj(
                "count" -> count,
                "lat" -> lat,
                "lng" -> lng
              )
            })
          )
        }
      }
    )
  }

  def getDBMBureauGData = DB.withConnection { implicit c =>

    val byAgency = SQL("""
      SELECT agency, COUNT(*), SUM(amount)
      FROM saro_bureau_g
      GROUP BY agency
      ORDER BY agency
    """).list(
      get[String]("agency") ~
      get[Long]("count") ~
      get[java.math.BigDecimal]("sum") map {
        case agency~count~amount => {
          Json.obj(
            "agency" -> agency,
            "count" -> count,
            "amount" -> BigDecimal(amount)
          )
        }
      }
    )

    val byMonth = SQL("""
      SELECT
        EXTRACT(YEAR FROM saro_date) AS year,
        EXTRACT(MONTH FROM saro_date) AS extracted_month,
        COUNT(*),
        SUM(amount)
      FROM saro_bureau_g
      WHERE saro_date IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM saro_date), extracted_month
      ORDER BY year, extracted_month
    """).list(
      get[Double]("year") ~
      get[Double]("extracted_month") ~
      get[Long]("count") ~
      get[java.math.BigDecimal]("sum") map { case _year~_month~count~amount =>
        val year = _year.toInt
        val month = _month.toInt
        Json.obj(
          "yearMonth" -> (year + "-" + (if (month < 10) "0" + month else month)),
          "count" -> count,
          "amount" -> BigDecimal(amount)
        )
      }
    )

    Json.obj(
      "byAgency" -> byAgency,
      "byMonth" -> byMonth
    )

  }

  private def getEPLCData = DB.withConnection { implicit c =>

    val list = SQL("SELECT * FROM dpwh_eplc").list(
      get[Option[Timestamp]]("contract_start_date") ~
      get[Option[Timestamp]]("contract_end_date") ~
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
      get[Option[Timestamp]]("activity_10_start_date") ~
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
      a1~
      a1start~
      a1end~
      a2~
      a2start~
      a2end~
      a3~
      a3start~
      a3end~
      a4~
      a4start~
      a4end~
      a5~
      a5start~
      a5end~
      a6~
      a6start~
      a6end~
      a7~
      a7start~
      a7end~
      a8~
      a8start~
      a8end~
      a9~
      a9start~
      a9end~
      a10~
      a10start~
      a10end~
      a11~
      a11start~
      a11end~
      project_type~
      months_of_completion~
      disaster => {

        def actOpt(name: Option[String], start: Option[Timestamp], end: Option[Timestamp]) = {
          for {
            name <- name
            start <- start
            end <- end
          } yield { (name, end.getTime - start.getTime) }
        }

        (List(
            actOpt(a1, a1start, a1end),
            actOpt(a2, a2start, a2end),
            actOpt(a3, a3start, a3end),
            actOpt(a4, a4start, a4end),
            actOpt(a5, a5start, a5end),
            actOpt(a6, a6start, a6end),
            actOpt(a7, a7start, a7end),
            actOpt(a8, a8start, a8end),
            actOpt(a9, a9start, a9end),
            actOpt(a10, a10start, a10end),
            actOpt(a11, a11start, a11end)
        ).flatten, Some(project_type.getOrElse("Other").capitalize), for {
          contract_start_date <- contract_start_date
          project_abc <- project_abc
        } yield { (contract_start_date, BigDecimal(project_abc)) },
          disaster
        )

      }
    })

    val averageDurations = list.map(_._1).flatten.groupBy(_._1).map { case (name, list) =>
      name -> (list.map(_._2).sum / list.size)
    }

    val byType = list.map(p => (p._2.get, p._4.get)).groupBy(x => x._1).map { case (projectType, list) =>
      projectType -> list.groupBy(_._2).map { case (disaster, list) =>
        disaster -> list.size
      }
    }.toList

    def extractYearMonth(t: Timestamp): String = {
      val c = Calendar.getInstance()
      c.setTimeInMillis(t.getTime)
      (c.get(Calendar.YEAR)) + "-" + "%02d".format(c.get(Calendar.MONTH) + 1)
    }

    val byMonth = list.map(_._3).flatten.groupBy(x => extractYearMonth(x._1)).map { case (ym, list) =>
      (ym, list.size, list.map(_._2).sum)
    }

    Json.obj(
      "aveDur" -> averageDurations,
      "byType" -> byType.map { case (projectType, list) => Json.obj(
        "projectType" -> projectType,
        "boholQty" -> list.find(_._1 == "Bohol Earthquake").map(_._2).getOrElse(0).toInt,
        "yolandaQty" -> list.find(_._1 == "Typhoon Yolanda").map(_._2).getOrElse(0).toInt
      )},
      "byMonth" -> byMonth.map { case (ym, count, amount) => Json.obj(
        "yearMonth" -> ym,
        "count" -> count,
        "amount" -> amount
      )}
    )

  }

}