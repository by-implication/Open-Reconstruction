package recon.support;

import java.util.{Calendar, TimeZone}
import java.sql.Timestamp

object Time {
  def apply(millis: Long): Timestamp = {
    val t = new java.sql.Timestamp(millis)
    t.setNanos(0)
    t
  }

  def apply(year: Int, month: Int, day: Int, hour: Int = 0, minute: Int = 0, second: Int = 0, timezone: String = "Asia/Manila"): Timestamp = {
    val c = Calendar.getInstance(TimeZone.getTimeZone(timezone))
    c.set(year, month-1, day, hour, minute, second)
    apply(c.getTimeInMillis())
  }

  def now = apply(System.currentTimeMillis())

  def offset(millis: Long) = apply(System.currentTimeMillis + millis)

}
