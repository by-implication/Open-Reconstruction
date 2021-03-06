/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

package recon

import anorm._
import com.redis.RedisClient
import play.api.Play.current
import scala.language.implicitConversions
import java.sql.Timestamp
import recon.support.Time

package object models {

  object Analytics {
    lazy val enabled = current.configuration.getBoolean("analytics.enabled").getOrElse(false)
    lazy val tracker = current.configuration.getString("analytics.tracker").getOrElse("UA-52262569-1")
  }

  lazy val bucketPath = current.configuration.getString("recon.bucket_path").getOrElse("buckets")
  lazy val attachmentPath = current.configuration.getString("recon.attachment_path").getOrElse("attachments")

  def NA = anorm.NotAssigned

  implicit def optionToPk[A](opt: Option[A]): Pk[A] = opt match {
    case Some(id) => Id(id)
    case None => NA
  }

  implicit def pkToA[A](pk: Pk[A]): A = pk.toOption match {
    case Some(id) => id
    case None => throw new RuntimeException("PK is not assigned")
  }

  object Redis {
    private def newConn() = new RedisClient("localhost", current.configuration.getInt("redis.port").getOrElse(6379))
    def xaction[A](f: RedisClient => A): A = {
      val c = newConn()
      val r = f(c)
      c.disconnect
      r
    }
  }

  implicit def longToTimestamp(t: Long): Timestamp = Time(t)
 
}