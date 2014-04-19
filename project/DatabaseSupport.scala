import java.sql.{Connection, DriverManager, ResultSet}
import java.io.{File, FileWriter, FilenameFilter}
import scala.io.Source

object DatabaseSupport {
  Class.forName("org.postgresql.Driver")

  val dbname = "recon_dev"
  val username = "postgres"
  val password = "postgres"

  var _conn: java.sql.Connection = null

  def conn = {
    if(_conn == null || _conn.isClosed()) {
      _conn = DriverManager.getConnection("jdbc:postgresql:"+dbname, username, password)
    }
    _conn
  }
}

object Evolutions {
  implicit val ord = new Ordering[File] {
    def compare(a: File, b: File): Int = {
      val aInt = a.getName.takeWhile(_.isDigit).toInt
      val bInt = b.getName.takeWhile(_.isDigit).toInt
      aInt compare bInt
    }
  }

  val sqlFilter = new FilenameFilter() {
    def accept(dir: File, name: String) = name.endsWith(".sql")
  }

  def load(evolutionsRoot: File) = {
    val sql = evolutionsRoot.listFiles(sqlFilter).sorted.map { f =>
      Source.fromFile(f).getLines
        .dropWhile(!_.contains("!Ups"))
        .drop(1).takeWhile(!_.contains("!Downs"))
        .reduceLeftOption(_+"\n"+_)
        .getOrElse("");
    }
    .reduceLeftOption(_+"\n"+_)
    .getOrElse("")
    Evolutions(sql, evolutionsRoot)
  }
}

case class Evolutions(sql: String, root: File) {
  val hashFile = new File(root, ".hash")

  def needsUpdate: Boolean = {
    if(hashFile.exists) {
      Source.fromFile(hashFile).getLines.toSeq.headOption.map { hash =>
        try {
          sql.hashCode != hash.toInt
        }
        catch {
          case e: Exception => true
        }
      }.getOrElse(true)
    }
    else {
      true
    }
  }

  def apply() = {
    import scala.collection.JavaConversions._

    println("[info] Reapplying evolutions to dummy database, PostgreSQL errors may follow")
    DatabaseSupport.conn.createStatement().execute("CREATE SCHEMA IF NOT EXISTS codegen")
    DatabaseSupport.conn.createStatement().execute("SET search_path TO codegen")
    var stmt = DatabaseSupport.conn.createStatement
    println(sql.replaceAll(";;", ";"))
    stmt.execute(sql.replaceAll(";;", ";"))
    for {
      initial <- Option(stmt.getWarnings)
      warning <- initial
    } println(warning)
    val fws = new FileWriter(hashFile)
    fws.write(sql.hashCode.toString)
    fws.close()
    DatabaseSupport.conn.createStatement().execute("SET search_path TO public")
    DatabaseSupport.conn.createStatement().execute("DROP SCHEMA codegen CASCADE")
    DatabaseSupport.conn.close();
  }
}
