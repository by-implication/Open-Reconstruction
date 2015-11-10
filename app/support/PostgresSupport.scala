/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

package recon.support

import anorm._

import org.postgresql.util._
import scala.language.implicitConversions

import scala.collection._

case class PGObject(sType: String, sValue: Any = Nil) extends PGobject {
	setType(sType)
	setValue(sValue.toString)
}

case class PGLTree(list: Seq[Int]) extends PGobject {
	override def toString = list.mkString(".")
	setType("ltree")
	setValue(toString)
}

object PGLTree {

	def fromString(s: String) = PGLTree(s.split("\\.").map(_.toInt))
	
	implicit def rowToPGLTree: Column[PGLTree] = {
		Column[PGLTree](transformer = { (value, meta) =>
			val MetaDataItem(qualified,nullable,clazz) = meta
			value match {
				case pgo: PGobject => Right {
					val v: String = pgo.getValue
					val list: Seq[Int] = if(v.isEmpty) Nil else v.split('.').map(_.toInt)
					PGLTree(list)
				}
				case _ => Left(TypeDoesNotMatch("Cannot convert " + value + " for column " + qualified))
			}
		})
	}

	implicit def seqToPGLTree(list: Seq[Int]): PGLTree = new PGLTree(list)

}

// http://tech.valgog.com/2009/02/passing-arrays-to-postgresql-database.html
abstract class PGList[T](fromList: Seq[T])(implicit m : scala.reflect.ClassTag[T]) extends SeqProxy[T] with java.sql.Array {

	val list = fromList

	override def self = list

	def free() = Unit

	def getArray(): Object = list.toArray[T]

	def getArray(map: java.util.Map[String, Class[_]]): Object = getArray()

	def getArray(index: Long, count: Int): Object = list.slice(index.toInt, index.toInt + count).toArray

	def getArray(index: Long, count: Int, map: java.util.Map[String, Class[_]]): Object = getArray(index, count)

	def getBaseTypeName(): String

	def getBaseType(): Int

	def getResultSet(): java.sql.ResultSet = {
		throw new UnsupportedOperationException()
		null
	}

	def getResultSet(map: java.util.Map[String, Class[_]]): java.sql.ResultSet = getResultSet()

	def getResultSet(index: Long, count: Int): java.sql.ResultSet = getResultSet()

	def getResultSet(index: Long, count: Int, map: java.util.Map[String, Class[_]]): java.sql.ResultSet = getResultSet()
}

object PGList {
	def numSeqToValue(seq: Iterable[Any]) = "{" + seq.map(_.toString).reduceLeftOption(_ + "," + _).getOrElse("") + "}"

	def strSeqToValue(seq: Iterable[Any]) = "{" + seq.map("\"" + _.toString + "\"").reduceLeftOption(_ + "," + _).getOrElse("") + "}"
}

class PGStringList(list: Seq[String]) extends PGList[String](list) {
	def getBaseTypeName() = "text"

	def getBaseType() = java.sql.Types.VARCHAR

	override def toString = PGList.strSeqToValue(list)
}

object PGStringList {
	def apply(list: Seq[String]) = new PGStringList(list)

	implicit def rowToPGStringList: Column[PGStringList] = {
		Column[PGStringList](transformer = { (value, meta) =>
			val MetaDataItem(qualified,nullable,clazz) = meta
			value match {
				case arr:java.sql.Array => Right(new PGStringList(arr.getArray().asInstanceOf[scala.Array[String]].toList))
				case _ => Left(TypeDoesNotMatch("Cannot convert " + value + " for column " + qualified))
			}
		})
	}

	implicit def seqToPGStringList(list: Seq[String]): PGStringList = new PGStringList(list)
}

class PGIntList(list: Seq[Int]) extends PGList[Int](list) {
	def getBaseTypeName() = "int4"

	def getBaseType() = java.sql.Types.INTEGER

	override def toString = PGList.numSeqToValue(list)
}

object PGIntList {
	def apply(list: Seq[Int]): PGIntList = new PGIntList(list)

	def fromJavaInt(list: Seq[java.lang.Integer]): PGIntList = apply(list.map { i => i.intValue })

	implicit def unboxInt(i: java.lang.Integer) = i.intValue

	implicit def rowToPGIntList: Column[PGIntList] = {
		Column[PGIntList](transformer = { (value, meta) =>
			val MetaDataItem(qualified,nullable,clazz) = meta
			value match {
				case arr:java.sql.Array => Right(PGIntList.fromJavaInt(arr.getArray().asInstanceOf[scala.Array[java.lang.Integer]].toList))
				case _ => Left(TypeDoesNotMatch("Cannot convert " + value + " for column " + qualified))
			}
		})
	}

	implicit def seqToPGIntList(list: Seq[Int]): PGIntList = new PGIntList(list)
}
