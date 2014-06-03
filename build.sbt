import net.litola.SassPlugin

name := "recon"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache
)

play.Project.playScalaSettings ++ SassPlugin.sassSettings ++ Seq(SassPlugin.sassOptions := Seq("--style", "compressed"))

// don't run built-in javascript compiler
javascriptEntryPoints <<= baseDirectory(base =>
  base / "app" / "assets" / "javascripts" / "main" ** "*.js"
)

// import sbt-js
seq(jsSettings: _*)

(includeFilter in (Compile, JsKeys.js)) := "main.jsm" || "lib.jsm"

(JsKeys.compilationLevel in (Compile, JsKeys.js)) := CompilationLevel.SIMPLE_OPTIMIZATIONS
// or WHITESPACE_ONLY or ADVANCED_OPTIMIZATIONS

(sourceDirectory in (Compile, JsKeys.js)) <<= (baseDirectory in Compile)(_ / "public" / "javascripts")

(resourceManaged in (Compile, JsKeys.js)) <<= (resourceManaged in Compile)(_ / "public" / "javascripts")

// hook everything up as a resource generator
(resourceGenerators in Compile) <+= (JsKeys.js in Compile)
