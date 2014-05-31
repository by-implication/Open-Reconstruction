package views.html

import play.api._
import play.api.templates.Html
import play.api.Play.current
import java.io.File
import scala.io.Source

object Jsm {
  def apply(path: String): Html = Html {
    if(Play.mode == Mode.Dev) {
      relativeTo("public", path+".jsm").map(script).fold("")(_+"\n"+_)
    }
    else {
      script(path+".js")
    }
  }

  def script(path: String): String = {
    val src = controllers.routes.Assets.at(path)
    s"""<script type="text/javascript" src="$src"></script>"""
  }

  def listSources(src: File): Seq[File] = {
    Source.fromFile(src).getLines()
      .map(_.trim)
      .filterNot(_.isEmpty)
      .filterNot(_.startsWith("\\#"))
      .map(new File(src.getParentFile(), _))
      .toSeq
      .flatMap {
        case jsm if jsm.getName.endsWith("jsm") =>
          listSources(jsm)
        case source =>
          Seq(source)
      }
  }

  def relativeTo(base: String, src: String): Seq[String] = {
    val root = new File(base, src)
    val sources = listSources(root)
    sources.map { source =>
      source.getPath.replaceFirst(base+"/", "")
    }
  }
}

