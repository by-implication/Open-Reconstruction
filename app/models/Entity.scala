package recon.models

import anorm._

trait EntityCompanion[T] {
  def insert(o: T): Option[T]
  def update(o: T): Boolean
  def delete(id: Int): Boolean
}

trait Entity[T] { self: T =>
  
  def id: Pk[Int]
  def companion: EntityCompanion[T]

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
