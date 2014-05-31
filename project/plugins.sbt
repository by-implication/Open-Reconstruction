// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

// Sonatype
resolvers += "Sonatype OSS Releases" at "https://oss.sonatype.org/content/repositories/releases"

// Untyped repository
resolvers += Resolver.url("untyped", url("http://ivy.untyped.com"))(Resolver.ivyStylePatterns)

// Use the Play sbt plugin for Play projects
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.1")

// use jlitola's play sass asset handler
addSbtPlugin("net.litola" % "play-sass" % "0.3.0")

// use sbt-js
addSbtPlugin("com.untyped" % "sbt-js" % "0.7")
