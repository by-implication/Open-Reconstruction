package recon

import anorm._
import java.sql.Timestamp
import play.api.mvc._
import play.api.Play.current

package object support {

	lazy val prerender = current.configuration.getBoolean("recon.prerender").getOrElse(false)

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
