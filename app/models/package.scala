package recon

import anorm._
import play.api.Play.current
import scala.language.implicitConversions

package object models {

  def NA = anorm.NotAssigned

  implicit def optionToPk[A](opt: Option[A]): Pk[A] = opt match {
    case Some(id) => Id(id)
    case None => NA
  }

  implicit def pkToA[A](pk: Pk[A]): A = pk.toOption match {
    case Some(id) => id
    case None => throw new RuntimeException("PK is not assigned")
  }
 
}