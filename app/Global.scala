import akka.actor._
import controllers._
import play.api._
import play.api.libs.concurrent.Akka._
import play.api.Play.current
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import recon.models._
import recon.support._

object Global extends GlobalSettings {

  var dailyChores: Option[Cancellable] = None

  lazy val tickActor = system.actorOf(Props(new Actor {
    def receive = {
      case "daily" => {

        play.Logger.info("Daily chores:")

        var count = Bucket.sweepStale()
        play.Logger.info("\tDeleted " + count + " expired buckets")

      }
    }
  }))

  override def onStart(app: play.api.Application){

    dailyChores = Some(system.scheduler.schedule(
      0.milliseconds,
      1.day,
      tickActor,
      "daily"
    )(system.dispatcher))

  }

  override def onStop(app: play.api.Application){
    dailyChores.map(_.cancel())
  }

}
