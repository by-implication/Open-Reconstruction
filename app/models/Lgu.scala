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

object Lgu extends LguGen {
  
  val REGIONS: Map[Int, String] = Map(
    1 -> "REGION I (ILOCOS REGION)",
    2 -> "REGION II (CAGAYAN VALLEY)",
    3 -> "REGION III (CENTRAL LUZON)",
    4 -> "REGION IV-A (CALABARZON)",
    5 -> "REGION V (BICOL REGION)",
    6 -> "REGION VI (WESTERN VISAYAS)",
    7 -> "REGION VII (CENTRAL VISAYAS)",
    8 -> "REGION VIII (EASTERN VISAYAS)",
    9 -> "REGION IX (ZAMBOANGA PENINSULA)",
    10 -> "REGION X (NORTHERN MINDANAO)",
    11 -> "REGION XI (DAVAO REGION)",
    12 -> "REGION XII (SOCCSKSARGEN)",
    13 -> "NATIONAL CAPITAL REGION (NCR)",
    14 -> "CORDILLERA ADMINISTRATIVE REGION (CAR)",
    15 -> "AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)",
    16 -> "REGION XIII (Caraga)",
    17 -> "REGION IV-B (MIMAROPA)"
  )

  val COUNTRY_COORDS = (11.71418113, 122.8633113)

  val regionCoords = Map(
    // derived from the ff query:
    // SELECT subltree(psgc, 0, 1) AS region_psgc,
    // AVG(lat) AS lat,
    // AVG(lng) AS lng,
    // count(*) AS brgy_count
    // FROM brgy_coords
    // GROUP BY region_psgc
    1 -> (16.7886690954272588, 120.4543667177947933),
    2 -> (17.3020475115101688, 121.6442143037646041),
    3 -> (15.2819972339200516, 120.7633921409735654),
    4 -> (14.0960827713762154, 121.3617269306906008),
    5 -> (13.2676663547392682, 123.5568594342264477),
    6 -> (10.9702569182606764, 122.5507338128116514),
    7 -> (9.9823965496570097, 123.7839503398268398),
    8 -> (11.3790479786394077, 124.9129041249886105),
    9 -> (7.8697531061759454, 123.0002622152836134),
    10 -> (8.2663644877462908, 124.3686687113748764),
    11 -> (7.0993165090731497, 125.7185672833046472),
    12 -> (6.7441183771535235, 124.7748120957214765),
    13 -> (14.6027146983401760, 120.9991967563636364),
    14 -> (17.1934712909795571, 120.9438917120102215),
    15 -> (7.0409433278988719, 123.2174687631748590),
    16 -> (9.0996309767719298, 125.8071374392829901),
    17 -> (12.1566019930212766, 120.8181391212079616)
  )

  def regionsJson = Json.toJson(REGIONS.toSeq.map {
    case (id, name) => Json.obj("id" -> id, "name" -> name, "psgc" -> id)
  })

  def getChildren(psgc: PGLTree) = getDescendants(psgc, true)

  def getDescendants(psgc: PGLTree, childrenOnly: Boolean = false): Seq[(GovUnit, Lgu)] = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM lgus LEFT join gov_units ON lgu_id = gov_unit_id
      WHERE lgu_psgc <@ {psgc}
      AND lgu_psgc != {psgc}
    """ + (if (childrenOnly) "AND nlevel(lgu_psgc) = nlevel({psgc}) + 1" else ""))
    .on('psgc -> psgc).list(GovUnit.simple ~ simple map(flatten))
  }

  def getLocFilters(psgc: PGLTree) = {

    val locFilters = Json.toJson((if(!psgc.list.isEmpty){

      def toJson(t: (GovUnit, Lgu)) = {
        val (govUnit, lgu) = t
        Json.obj(
          "id" -> lgu.psgc.toString,
          "name" -> govUnit.name
        )
      }

      val psgcIntSeq = psgc.list.take(3)

      psgcIntSeq.zipWithIndex.map { case (e, i) =>
        Json.toJson(Lgu.getChildren(PGLTree(psgcIntSeq.take(i+1))).map(toJson))
      }.toList

    } else List.empty[JsArray]).padTo(3, Json.arr())).as[JsArray]

    Json.arr(Lgu.regionsJson) ++ locFilters

  }

}

// GENERATED case class start
case class Lgu(
  id: Pk[Int] = NA,
  incomeClass: Option[Int] = None,
  psgc: PGLTree = Nil,
  lat: Option[BigDecimal] = None,
  lng: Option[BigDecimal] = None
) extends LguCCGen with Entity[Lgu]
// GENERATED case class end
{

  def updateDescendantSearchKeys() = DB.withConnection { implicit c =>

    for {
      len <- (psgc.list.length + 1) to 4
    } yield {
      SQL("""
        UPDATE gov_units g
        SET gov_unit_search_key = concat(g.gov_unit_name, ', ', parent.gov_unit_search_key)
        FROM lgus l, gov_units parent, lgus parent_lgu
        WHERE parent_lgu.lgu_id = parent.gov_unit_id
        AND parent_lgu.lgu_psgc <@ {psgc}
        AND nlevel(parent_lgu.lgu_psgc) = {len} - 1
        AND nlevel(l.lgu_psgc) = {len}
        AND l.lgu_id = g.gov_unit_id
        AND l.lgu_psgc <@ {psgc}
        AND l.lgu_psgc != parent_lgu.lgu_psgc
      """).on(
        'psgc -> psgc,
        'len -> len
      ).executeUpdate()
    }

  }

  lazy val level = psgc.list.length - 1

  private def getMeanCoord(coord: String) = DB.withConnection { implicit c =>
    SQL("SELECT COALESCE(AVG(lgu_" + coord + "), 0) FROM lgus WHERE lgu_psgc <@ {psgc}")
    .on('psgc -> psgc)
    .single(get[BigDecimal]("coalesce"))
  }

  def getMeanLat = getMeanCoord("lat")
  def getMeanLng = getMeanCoord("lng")

  def children = Lgu.getChildren(psgc)
  def ancestors = DB.withConnection { implicit c =>
    SQL("""
      SELECT * FROM lgus LEFT JOIN gov_units ON gov_unit_id = lgu_id
      WHERE lgu_psgc @> {psgc} and lgu_psgc != {psgc}
      ORDER BY lgu_psgc ASC
    """).on('psgc -> psgc).list(GovUnit.simple)
  }
}

// GENERATED object start
trait LguGen extends EntityCompanion[Lgu] {
  val simple = {
    get[Pk[Int]]("lgu_id") ~
    get[Option[Int]]("lgu_income_class") ~
    get[PGLTree]("lgu_psgc") ~
    get[Option[BigDecimal]]("lgu_lat") ~
    get[Option[BigDecimal]]("lgu_lng") map {
      case id~incomeClass~psgc~lat~lng =>
        Lgu(id, incomeClass, psgc, lat, lng)
    }
  }

  def lazyFind(column: String, value: Any) = SQL("select * from lgus where "+column+" = {value}").on('value -> value)

  def findOne(column: String, value: Any): Option[Lgu] = DB.withConnection { implicit c =>
    lazyFind(column, value).singleOpt(simple)
  }

  def findAll(column: String, value: Any): Seq[Lgu] = DB.withConnection { implicit c =>
    lazyFind(column, value).list(simple)
  }

  def findById(id: Int): Option[Lgu] = findOne("lgu_id", id)

  def list(count: Int = 10, offset: Int = 0): Seq[Lgu] = DB.withConnection { implicit c =>
    SQL("select * from lgus limit {count} offset {offset}").on('count -> count, 'offset -> offset).list(simple)
  }

  def listAll(): Seq[Lgu] = DB.withConnection { implicit c =>
    SQL("select * from lgus order by lgu_id").list(simple)
  }

  def insert(o: Lgu): Option[Lgu] = DB.withConnection { implicit c =>
    o.id match {
      case NotAssigned => {
        val id = SQL("""
          insert into lgus (
            lgu_id,
            lgu_income_class,
            lgu_psgc,
            lgu_lat,
            lgu_lng
          ) VALUES (
            DEFAULT,
            {incomeClass},
            {psgc},
            {lat},
            {lng}
          )
        """).on(
          'id -> o.id,
          'incomeClass -> o.incomeClass,
          'psgc -> o.psgc,
          'lat -> o.lat,
          'lng -> o.lng
        ).executeInsert()
        id.map(i => o.copy(id=Id(i.toInt)))
      }
      case Id(n) => {
        SQL("""
          insert into lgus (
            lgu_id,
            lgu_income_class,
            lgu_psgc,
            lgu_lat,
            lgu_lng
          ) VALUES (
            {id},
            {incomeClass},
            {psgc},
            {lat},
            {lng}
          )
        """).on(
          'id -> o.id,
          'incomeClass -> o.incomeClass,
          'psgc -> o.psgc,
          'lat -> o.lat,
          'lng -> o.lng
        ).executeInsert().flatMap(x => Some(o))
      }
    }
  }

  def update(o: Lgu): Boolean = DB.withConnection { implicit c =>
    SQL("""
      update lgus set
        lgu_income_class={incomeClass},
        lgu_psgc={psgc},
        lgu_lat={lat},
        lgu_lng={lng}
      where lgu_id={id}
    """).on(
      'id -> o.id,
      'incomeClass -> o.incomeClass,
      'psgc -> o.psgc,
      'lat -> o.lat,
      'lng -> o.lng
    ).executeUpdate() > 0
  }

  def delete(id: Int): Boolean = DB.withConnection { implicit c =>
    SQL("delete from lgus where lgu_id={id}").on('id -> id).executeUpdate() > 0
  }
}

trait LguCCGen {
  val companion = Lgu
}
// GENERATED object end

