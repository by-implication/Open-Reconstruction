import java.sql.{Connection, DriverManager, ResultSet}

class RegularType(val name: String, val default: String) extends CType

class NoParseType(name: String, default: String) extends RegularType(name, default) {
  override def parseDefault(input: String) = None
}

class StringType extends RegularType("String", "\"\"") {
  override def parseDefault(input: String) =
    if(input.startsWith("'"))
      Some('"'+input.drop(1).dropRight(7)+'"')
    else
      None
}

class BooleanType extends RegularType("Boolean", "true") {
  override def parseDefault(input: String) =
    if(input.startsWith("t"))
      Some("true")
    else
      Some("false")
}

class NumericType extends RegularType("BigDecimal", "0") {
  override def modelType: String = "BigDecimal"
  override def getType: String = "java.math.BigDecimal"
  override def saveExpression(fieldName: String): String = fieldName+".bigDecimal"
}

class EnumType(e: Enum) extends CType {
  val name = NameMapping.toClassCase(e.name)
  val default = formatValue(e.values(0))
  override def parseDefault(input: String) =
    if(input.startsWith("'"))
      Some(formatValue(input.drop(1).dropRight(3+e.name.length)))
    else
      None

  def formatValue(value: String) = name+"."+value.toUpperCase
}

class NullableType(ctype: CType) extends CType {
  val name = ctype.name
  val default = "None"
  override def modelType = "Option["+name+"]"
  override def getType = "Option["+name+"]"
  override def parseDefault(input: String) = ctype.parseDefault(input).map(o => "Some("+o+")")
}

class IdType(ctype: CType) extends CType {
  val name = ctype.name
  val default = "NA"
  override def modelType = "Pk["+name+"]"
  override def getType = "Pk["+name+"]"
  override def parseDefault(input: String) = None
}

object PostgresMetadata {
  lazy val dbTypeMapping = Map(
    "bool" -> new BooleanType,
    "int4" -> new RegularType("Int", "0"),
    "int2" -> new RegularType("Short", "0"),
    "float4" -> new RegularType("Float", "0"),
    "timestamp" -> new NoParseType("Timestamp", "Time.now"),
    "text" -> new StringType,
    "numeric" -> new NumericType,
    "_text" -> new NoParseType("PGStringList", "Nil"),
    "_int4" -> new NoParseType("PGIntList", "Nil"),
    "ltree" -> new NoParseType("PGLTree", "Nil")
  ) ++ listEnums().map(e => (e.name, new EnumType(e)))

  def mapType(c: Column) = {
    val ctype = dbTypeMapping.get(c.ctype)
    .getOrElse(new RegularType(
      NameMapping.toClassCase(c.ctype),
      "null"
    ))
    if(c.primaryKey)
      new IdType(ctype)
    else if(c.nullable)
      new NullableType(ctype)
    else
      ctype
  }

  def conn = DatabaseSupport.conn

  def query(table: String) = {
    val queryStatement = conn.prepareStatement("""
        select
          attname,
          typname,
          attnotnull,
          exists(select attnum from pg_index where attnum = any(indkey) and indisprimary and indrelid=pg_class.oid) attprimary,
          adsrc
        from pg_attribute
          join pg_class on pg_class.oid=attrelid
          join pg_type on pg_type.oid=atttypid
          left join pg_attrdef on adrelid=attrelid and adnum=attnum
        where relname=? and attnum > 0;
      """)
    queryStatement.setString(1, table)
    val result = queryStatement.executeQuery()
    var columns: Seq[Column] = Seq.empty
    while(result.next) {
      columns = columns :+ Column(result.getString(1), result.getString(2), !result.getBoolean(3), result.getBoolean(4), Option(result.getString(5)))
    }
    Table(table, columns)
  }

  def list() = {
    val statement = conn.prepareStatement("select tablename from pg_tables where schemaname='public' and not tablename='play_evolutions'")
    val result = statement.executeQuery()
    var tables: Seq[String] = Seq.empty
    while(result.next) {
      tables = tables :+ result.getString(1)
    }
    tables.map(query(_))
  }

  def listEnums() = {
    val statement = conn.prepareStatement("select t.typname as type, t.oid as oid from pg_type t left join pg_catalog.pg_namespace n on n.oid = t.typnamespace where (t.typrelid = 0 or (select c.relkind = 'c' from pg_catalog.pg_class c where c.oid = t.typrelid)) and not exists(select 1 from pg_catalog.pg_type el where el.oid = t.typelem and el.typarray = t.oid) and n.nspname not in ('pg_catalog', 'information_schema') and typtype='e'")
    val result = statement.executeQuery()
    var enums: Seq[(String, Int)] = Seq.empty
    while(result.next) {
      enums = enums :+ (result.getString(1), result.getInt(2))
    }

    val enumStatement = conn.prepareStatement("select enumlabel from pg_enum where enumtypid=?")
    enums.map { t =>
      enumStatement.setInt(1, t._2)
      val result = enumStatement.executeQuery()
      var values: Seq[String] = Seq.empty
      while(result.next) {
        values = values :+ result.getString(1)
      }
      Enum(t._1, values)
    }
  }

  val enumMap = listEnums().map { e => (e.name, e) }.toMap
}

case class Table(name: String, columns: Seq[Column]) {
  def pk = columns.find(_.primaryKey).get
  val isManyToMany = columns.count(_.primaryKey) != 1
}

case class Column(name: String, ctype: String, nullable: Boolean, primaryKey: Boolean, default: Option[String])

case class Enum(name: String, values: Seq[String])
