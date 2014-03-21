import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

    val appName         = "recon"
    val appVersion      = "alpha"

    val appDependencies = Seq(
      jdbc, anorm, filters,
      "postgresql" % "postgresql" % "9.1-901.jdbc4",
      "com.typesafe" %% "play-plugins-mailer" % "2.1.0"
    )

    val main = play.Project(appName, appVersion, appDependencies).settings(
      // Add your own project settings here
      sourceGenerators in Compile <+= (baseDirectory) map GenerateSource.apply,
      scalacOptions ++= Seq("-feature")
    )

}
