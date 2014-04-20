/* AUTOGENERATED */
package recon.models

import recon.support._

sealed class DisasterType(override val name: String) extends PGObject("disaster_type", name) with DisasterType.Value
object DisasterType extends Enum[DisasterType] {
  val TYPHOON = new DisasterType("Typhoon")
  val EARTHQUAKE = new DisasterType("Earthquake")
  val FLOOD = new DisasterType("Flood")
  val LANDSLIDE = new DisasterType("Landslide")
  val FIRE = new DisasterType("Fire")
  val ANTHROPOGENIC = new DisasterType("Anthropogenic")
  val NONE_OR_PREVENTIVE = new DisasterType("None or Preventive")
  val list = List(TYPHOON, EARTHQUAKE, FLOOD, LANDSLIDE, FIRE, ANTHROPOGENIC, NONE_OR_PREVENTIVE)
}

sealed class ProjectType(override val name: String) extends PGObject("project_type", name) with ProjectType.Value
object ProjectType extends Enum[ProjectType] {
  val BRIDGE = new ProjectType("Bridge")
  val BUILDING = new ProjectType("Building")
  val EQUIPMENT = new ProjectType("Equipment")
  val EVAC_CENTER = new ProjectType("Evac Center")
  val FINANCIAL_AID = new ProjectType("Financial Aid")
  val FLOOD_CONTROL = new ProjectType("Flood Control")
  val HOUSING = new ProjectType("Housing")
  val IRRIGATION_SYSTEM = new ProjectType("Irrigation System")
  val RIVER_CONTROL = new ProjectType("River Control")
  val RIVERS = new ProjectType("Rivers")
  val ROAD = new ProjectType("Road")
  val SCHOOL_BUILDING = new ProjectType("School Building")
  val SEAWALL = new ProjectType("Seawall")
  val WATER_SYSTEM = new ProjectType("Water System")
  val OTHERS = new ProjectType("Others")
  val list = List(BRIDGE, BUILDING, EQUIPMENT, EVAC_CENTER, FINANCIAL_AID, FLOOD_CONTROL, HOUSING, IRRIGATION_SYSTEM, RIVER_CONTROL, RIVERS, ROAD, SCHOOL_BUILDING, SEAWALL, WATER_SYSTEM, OTHERS)
}

sealed class ProjectScope(override val name: String) extends PGObject("project_scope", name) with ProjectScope.Value
object ProjectScope extends Enum[ProjectScope] {
  val REPAIR_AND_REHABILITATION = new ProjectScope("Repair and Rehabilitation")
  val RECONSTRUCTION = new ProjectScope("Reconstruction")
  val OTHER = new ProjectScope("Other")
  val list = List(REPAIR_AND_REHABILITATION, RECONSTRUCTION, OTHER)
}
