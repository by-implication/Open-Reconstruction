/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

package recon.models

import anorm._
import recon.support._
import play.api.libs.json.Json
import play.api.libs.json.Json.JsValueWrapper
import play.api.libs.json.JsValue

trait EntityCompanion[T] {
  def insert(o: T): Option[T]
  def update(o: T): Boolean
  def delete(id: Int): Boolean
}

trait Entity[T] { self: T =>
  
  def id: Pk[Int]
  def companion: EntityCompanion[T]

  def insertSeq(): Seq[(String, JsValueWrapper)] = Seq("id" -> id)
  def insertJson(): JsValue = Json.obj(insertSeq:_*)

  /** Inserts the record into the database
    */
  def create(): Option[T] = companion.insert(self)

  def delete(): Boolean = companion.delete(id)

  /** Inserts the record if the id is NotAssigned otherwise, it
    * updates the record.
    */
  def save(): Option[T] = id match {
    case Id(s) => if(companion.update(self)) Some(self) else None
    case NotAssigned => create()
  }

  def upsert(): Option[T] = save() match {
    case Some(e) => Some(e)
    case None => create()
  }

}
