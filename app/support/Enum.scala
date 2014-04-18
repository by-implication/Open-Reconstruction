package recon.support

import anorm._
import play.api.libs.json.Json

import org.postgresql.util.PGobject

/** Superclass for enum types
  *
  * @see [[http://stackoverflow.com/questions/1898932/case-classes-vs-enumerations-in-scala]]
  */
trait Enum[A] {
	trait Value { self: A =>
		_values += ((this.name, this))

		val name: String

		override def toString = name
	}

	private var _values = Map.empty[String, A]

	def values = _values

	def jsonList = Json.toJson(values.map(_._1))

	def toSelectJson = Json.toJson(values.map(v => Json.obj(
		"value" -> v._1,
		"label" -> v._2.toString.capitalize
	)))

	def withName(name: String): A = values.get(name).get

	def withNameOption(name: String): Option[A] = values.get(name)

	def contains(name: String) = values.contains(name)

	implicit def rowToA: Column[A] = {
		Column[A](transformer = { (value, meta) =>
			val MetaDataItem(qualified,nullable,clazz) = meta
			value match {
				case pgo:PGobject if contains(pgo.getValue) => Right(withName(pgo.getValue))
				case _ => Left(TypeDoesNotMatch("Cannot convert " + value + " for column " + qualified))
			}
		})
	}

}
