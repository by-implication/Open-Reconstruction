package recon

import anorm._
import java.io.File
import java.sql.Timestamp
import play.api.libs.json.{Json, JsValue, Writes}
import play.api.mvc._
import scala.language.implicitConversions
import scala.util.Random

package object support {

	def deleteFile(file: File): Boolean = {
	  if(!file.exists) true
	  else if(!file.isDirectory){
	    file.delete
	  } else {
	    file.listFiles.map(deleteFile(_)).fold(true)(_&&_) && file.delete
	  }
	}

	def generateRandomString(length: Int, alphabet: Seq[Char]): String = {
	  (1 to length).map { _ =>
	    val index = Random.nextInt(alphabet.length)
	    alphabet(index)
	  }.mkString("")
	}

	implicit def pkToInt(id: Pk[Int]): Int = id.get

	implicit val pkWrites = new Writes[Pk[Int]] {
    implicit def writes(id: Pk[Int]): JsValue = Json.toJson(pkToInt(id))
  }

	def padLeft(s: String, len: Int, pad: String) = (pad * (len - s.length)) + s

	implicit def rowToTimestamp: Column[Timestamp] = {
	  Column[Timestamp](transformer = { (value, meta) =>
	    val MetaDataItem(qualified,nullable,clazz) = meta
	    value match {
	      case time:java.sql.Timestamp => Right(time)
	      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + " to Timestamp for column " + qualified))
	    }
	  })
	}

	def redirect(newSession: Session = null)(implicit request: RequestHeader) = {
	  val url = request.session.get("redirect")
	    .orElse(request.headers.get("Referer"))
	    .filterNot(_.contains("/login"))
	    .getOrElse(controllers.routes.Application.index.url)
	  Rest.redirect(url).withSession(Option(newSession).getOrElse(request.session) - "redirect")
	}

}
