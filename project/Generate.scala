import java.io.{File,FileWriter}
import scala.io.Source

object GenerateSource {
  val imports = Seq(
    "anorm._",
    "anorm.SqlParser._",
    "java.sql.Timestamp",
    "play.api.db._",
    "play.api.libs.json._",
    "play.api.Play.current",
    "recon.support._"
  )

  def apply(baseDirectory: File): Seq[File] = {
    val modelRoot = new File(baseDirectory, "app/models")
    val ignoreFile = new File(modelRoot, ".generateignore")
    val enumFile = new File(modelRoot, "Enums.scala")

    var indentCount = 0

    def m = "\n" + " " * indentCount

    def i(n: Int = 2) = {
      indentCount += n
      m
    }

    def u(n: Int = 2) = {
      indentCount -= n
      m
    }

    def generateEnum(e: Enum) = {
      val t = NameMapping.toClassCase(e.name)
      def name(v: String) = v.toUpperCase.replaceAll(" ", "_")
      val valueNames = e.values.map(_.toUpperCase.replaceAll(" ", "_"))
      "sealed class "+t+"(override val name: String) extends PGObject(\""+e.name+"\", name) with "+t+".Value\n"+
      "object "+t+" extends Enum["+t+"] {\n"+
      e.values.map { v =>
        "  val "+name(v)+" = new "+t+"(\""+v+"\")"
      }.reduceOption(_+"\n"+_).getOrElse("")+"\n"+
      "  val list = " + e.values.map(name) + "\n" +
      "}"+"\n"
    }

    def generateFile(c: Model) = {
      val targetFile = new File(modelRoot, c.name+".scala")

      val caseClassStart = "// GENERATED case class start"
      val caseClassEnd = "// GENERATED case class end"
      val objectStart = "// GENERATED object start"
      val objectEnd = "// GENERATED object end"

      indentCount = 0

      val fieldNames = c.fields.map(_.name)

      def genCaseClass =
        caseClassStart+m+
        "case class "+c.name+"("+i()+
          c.fields.map(f => f.name+": "+f.modelType+" = "+f.default.replaceAll(" ", "_")).reduce(_+","+m+_)+u()+
        ") extends "+c.name+"CCGen with Entity["+c.name+"]"+m+
        caseClassEnd+m

      def genObject = {
        def parser =
          "val simple = {"+i()+
            c.fields.zip(c.originalColumns).map {
              case (f, Column(column, _, _, _, _)) => "get["+f.getType+"](\""+column+"\")"
            }.reduce(_+" ~"+m+_)+" map {"+i()+
              "case "+fieldNames.reduce(_+"~"+_)+" =>"+i()+
                c.name+"("+fieldNames.reduce(_+", "+_)+")"+u(4)+
            "}"+u()+
          "}"

        def lazyFind = """def lazyFind(column: String, value: Any) = SQL("select * from """+c.table.name+""" where "+column+" = {value}").on('value -> value)"""

        def findOne =
          "def findOne(column: String, value: Any): Option["+c.name+"] = DB.withConnection { implicit c =>"+i()+
            "lazyFind(column, value).singleOpt(simple)"+u()+
          "}"

        def findAll =
          "def findAll(column: String, value: Any): Seq["+c.name+"] = DB.withConnection { implicit c =>"+i()+
            "lazyFind(column, value).list(simple)"+u()+
          "}"

        def findById = "def findById(id: "+c.idType+"): Option["+c.name+"] = findOne(\""+c.table.pk.name+"\", id)"

        def list = {
          "def list(count: Int = 10, offset: Int = 0): Seq["+c.name+"] = DB.withConnection { implicit c =>"+i()+
            "SQL(\"select * from "+c.table.name+" limit {count} offset {offset}\").on('count -> count, 'offset -> offset).list(simple)"+u()+
          "}"
        }

        def insert =
          "def insert(o: "+c.name+"): Option["+c.name+"] = DB.withConnection { implicit c =>"+i()+
            "o."+c.id.name+" match {"+i()+
              "case NotAssigned => {"+i()+
                "val id = SQL(\"\"\""+i()+
                  "insert into "+c.table.name+" ("+i()+
                    c.table.columns.map(_.name).reduce(_+","+m+_)+u()+
                  ") VALUES ("+i()+
                    fieldNames.map(f => if (f == "id") "DEFAULT" else "{"+f+"}").reduce(_+","+m+_)+u()+
                  ")"+u()+
                "\"\"\").on("+i()+
                  fieldNames.zip(c.fields.map(_.saveExpression)).map(n => "'"+n._1+" -> o."+n._2).reduce(_+","+m+_)+u()+
                ").executeInsert()"+m+
                "id.map(i => o.copy("+c.id.name+"=Id(i"+(if(c.idType != "Long") ".to"+c.idType else "")+")))"+u()+
              "}"+m+
              "case Id(n) => {"+i()+
                "SQL(\"\"\""+i()+
                  "insert into "+c.table.name+" ("+i()+
                    c.table.columns.map(_.name).reduce(_+","+m+_)+u()+
                  ") VALUES ("+i()+
                    fieldNames.map("{"+_+"}").reduce(_+","+m+_)+u()+
                  ")"+u()+
                "\"\"\").on("+i()+
                  fieldNames.zip(c.fields.map(_.saveExpression)).map(n => "'"+n._1+" -> o."+n._2).reduce(_+","+m+_)+u()+
                ").executeInsert().flatMap(x => Some(o))"+u()+
              "}"+u()+
            "}"+u()+
          "}"

        def update =
          "def update(o: "+c.name+"): Boolean = DB.withConnection { implicit c =>"+i()+
            "SQL(\"\"\""+i()+
              "update "+c.table.name+" set"+i()+
                c.table.columns.zip(fieldNames).drop(1).map {
                  case (Column(name, _, _, _, _), fieldname) => name+"={"+fieldname+"}"
                }.reduce(_+","+m+_)+u()+
              "where "+c.table.pk.name+"={id}"+u()+
            "\"\"\").on("+i()+
              fieldNames.zip(c.fields.map(_.saveExpression)).map(n => "'"+n._1+" -> o."+n._2).reduce(_+","+m+_)+u()+
            ").executeUpdate() > 0"+u()+
          "}"

        def delete =
          "def delete(id: "+c.idType+"): Boolean = DB.withConnection { implicit c =>"+i()+
            "SQL(\"delete from "+c.table.name+" where "+c.table.pk.name+"={id}\").on('id -> id).executeUpdate() > 0"+u()+
          "}"

        objectStart+m+
        "trait "+c.name+"Gen extends EntityCompanion["+c.name+"] {"+i()+
          Seq(
            parser,
            lazyFind,
            findOne,
            findAll,
            findById,
            list,
            insert,
            update,
            delete
          ).reduceLeft(_+u()+i()+_)+
          u()+
        "}"+m+
        m+
        "trait "+c.name+"CCGen {"+i()+
          "val companion = "+c.name+u()+
        "}"+m+
        objectEnd+m
      }

      val sourceCode = if(!targetFile.exists()) {
        "package recon.models"+m*2+
        imports.map("import "+_).reduce(_+m+_)+m*2+
        "object "+c.name+" extends "+c.name+"Gen {"+m+
        "}"+m*2+
        genCaseClass+m+
        genObject+m
      }
      else {
        val lines = Source.fromFile(targetFile).getLines()
        lines.takeWhile(_!=caseClassStart).reduceOption(_+m+_).getOrElse("")+m+
        genCaseClass+
        lines.dropWhile(_!=caseClassEnd).drop(1).takeWhile(_!=objectStart).reduceOption(_+m+_).getOrElse("")+m+
        genObject+
        lines.dropWhile(_!=objectEnd).drop(1).reduceOption(_+m+_).getOrElse("")+m
      }

      val fws = new FileWriter(targetFile)
      fws.write(sourceCode)
      fws.close()
      targetFile
    }

    // THIS IS WHERE IT ACTUALLY STARTS
    val evolutions = Evolutions.load(new File(modelRoot, "../../conf/evolutions/default"))

    val ignore = Source.fromFile(ignoreFile).getLines().toSet

    if(!evolutions.needsUpdate) {
      Nil
    }
    else if(ignore.contains("*")) {
      Nil
    }
    else {
      try {
        DatabaseSupport.conn.createStatement().execute("CREATE SCHEMA IF NOT EXISTS codegen")
        DatabaseSupport.conn.createStatement().execute("SET search_path TO codegen,public")
        evolutions.apply()
        DatabaseSupport.conn.createStatement().execute("SET search_path TO codegen,public")
        val newTables = PostgresMetadata.list()
          .filter(!_.isManyToMany)
          .map(Model(_))
          .filter { m: Model => !ignore.contains(m.name) }
          .map { m =>
            println("[info] Generating "+m.name)
            generateFile(m)
            m.name -> m.hashCode
          }

        val newEnums = {
          val enums = PostgresMetadata.listEnums()
          enums.map(generateEnum(_)).reduceOption(_+"\n"+_).map { es =>
            val fws = new FileWriter(enumFile)
            fws.write(
              "/* AUTOGENERATED */\n"+
              "package recon.models\n\n"+
              "import recon.support._\n\n"+
              es
            )
            fws.close()
            "Enums" -> enums.hashCode
          }.toSeq
        }

        (newTables ++ newEnums).map(t => new File(modelRoot, t._1+".scala")).toSeq

      } finally {
        DatabaseSupport.conn.createStatement().execute("SET search_path TO public")
        DatabaseSupport.conn.createStatement().execute("DROP SCHEMA codegen CASCADE")
        DatabaseSupport.conn.close()
      }
    }
  }
}


