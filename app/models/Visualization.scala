package recon.models

import anorm._
import anorm.SqlParser._
import java.sql.{Date, Timestamp}
import java.util.Calendar
import play.api.db._
import play.api.libs.json._
import play.api.Play.current
import recon.support._

object Visualization {

  def getData(v: String) = { v match {
    case "EPLC" => Some(getEPLCData)
    case "DBMBureauG" => Some(Json.toJson(getDBMBureauGData))
    case "landing" => getLanding
    case _ => None
  }}

  def getLanding = DB.withConnection { implicit c =>

    def disasterProjects(disaster: String): Seq[(Long, BigDecimal)] = {
      SQL("""
        SELECT project_funded, count(*), coalesce(sum(project_amount),0) as sum
        FROM projects LEFT JOIN reqs on projects.req_id = reqs.req_id
        WHERE req_disaster_name ILIKE '%""" + disaster + """%'
        GROUP BY project_funded ORDER BY project_funded ASC
      """).list(
        get[Long]("count") ~
        get[java.math.BigDecimal]("sum") map {
          case count~sum => (count, BigDecimal(sum))
        }
      )
    }

    SQL("""
      SELECT yolanda.count as yolanda_req_qty, yolanda.sum as yolanda_req_amt,
        bohol.count as bohol_req_qty, bohol.sum as bohol_req_amt,
        saro_yolanda.count as yolanda_saro_qty,
        saro_yolanda.sum as yolanda_saro_amt
      FROM (
        SELECT count(*), sum(req_amount)
        FROM reqs
        WHERE req_disaster_name ILIKE '%yolanda%'
      ) as yolanda,
      (
        SELECT count(*), sum(req_amount)
        FROM reqs
        WHERE req_disaster_name ILIKE '%bohol%'
      ) as bohol,
      (
        SELECT count(*), sum(amount) FROM saro_bureau_g
      ) as saro_yolanda
    """).singleOpt(
      get[Long]("yolanda_req_qty") ~
      get[java.math.BigDecimal]("yolanda_req_amt") ~
      get[Long]("bohol_req_qty") ~
      get[java.math.BigDecimal]("bohol_req_amt") ~
      get[Long]("yolanda_saro_qty") ~
      get[java.math.BigDecimal]("yolanda_saro_amt") map {

        case yolanda_req_qty ~ yolanda_req_amt ~
          bohol_req_qty ~ bohol_req_amt ~
          yolanda_saro_qty ~ yolanda_saro_amt => {

          val List(bohol_unfunded, bohol_funded) = disasterProjects("bohol")
          val List(yolanda_unfunded, yolanda_funded) = disasterProjects("yolanda")

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
              "fundedProjects" -> (qtyAmt _ tupled yolanda_funded)
            ),
            "bohol" -> Json.obj(
              "req" -> qtyAmt(bohol_req_qty, bohol_req_amt),
              "projects" -> qtyAmt(
                bohol_unfunded._1 + bohol_funded._1,
                bohol_unfunded._2 + bohol_funded._2
              ),
              "fundedProjects" -> (qtyAmt _ tupled bohol_funded)
            )
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
        EXTRACT(MONTH FROM saro_date) AS month,
        COUNT(*),
        SUM(amount)
      FROM saro_bureau_g
      WHERE saro_date IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM saro_date), month
      ORDER BY year, month
    """).list(
      get[Double]("year") ~
      get[Double]("month") ~
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
        ).flatten, project_type, for {
          contract_start_date <- contract_start_date
          project_abc <- project_abc
        } yield { (contract_start_date, BigDecimal(project_abc)) })

      }
    })

    val averageDurations = list.map(_._1).flatten.groupBy(_._1).map { case (name, list) =>
      name -> (list.map(_._2).sum / list.size)
    }

    val byType = list.map(_._2).flatten.groupBy(x => x).map { case (name, list) =>
      name -> list.size
    }.toList.sortBy(_._2).reverse

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
      "byType" -> byType.map { case (name, count) => Json.obj(
        "n" -> name,
        "c" -> count
      )},
      "byMonth" -> byMonth.map { case (ym, count, amount) => Json.obj(
        "yearMonth" -> ym,
        "count" -> count,
        "amount" -> amount
      )}
    )

  }

}