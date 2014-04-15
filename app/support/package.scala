package recon

import anorm._
import java.sql.Timestamp

package object support {

	implicit def rowToTimestamp: Column[Timestamp] = {
	  Column[Timestamp](transformer = { (value, meta) =>
	    val MetaDataItem(qualified,nullable,clazz) = meta
	    value match {
	      case time:java.sql.Timestamp => Right(time)
	      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + " to Timestamp for column " + qualified))
	    }
	  })
	}

}
