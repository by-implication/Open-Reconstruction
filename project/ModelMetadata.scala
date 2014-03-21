object NameMapping {
  val underscored = """_[a-z0-9]"""r

  def toClassCase(input: String) = toCamelCase(input).capitalize

  def toCamelCase(input: String) = underscored.replaceAllIn(input, m => ""+m.matched(1).toUpper)

  val classTypeMapping = Map(
    "sellers" -> "SellerInfo"
  )

  def mapModel(ctype: String) = classTypeMapping.get(ctype).getOrElse {
    val n = toCamelCase(ctype).capitalize
    if(n.endsWith("s")) n.dropRight(1) else n
  }
}

trait CType {
  def name: String
  def default: String
  def modelType: String = name
  def getType: String = name
  def saveExpression(fieldName: String): String = fieldName
  def parseDefault(input: String): Option[String] = Some(input)
}

case class Model(name: String, fields: Seq[Field], table: Table) {
  def originalColumns = table.columns

  lazy val id: Field = fields.find(_.ctype.isInstanceOf[IdType]).get
  lazy val idType: String = id.ctype.name
}

object Model {
  def apply(t: Table): Model = Model(NameMapping.mapModel(t.name), t.columns.map(Field(t.name, _)), t)
}

case class Field(name: String, ctype: CType, _default: Option[String]) {
  def default = _default.getOrElse(ctype.default)
  def modelType = ctype.modelType
  def getType = ctype.getType
  def saveExpression = ctype.saveExpression(name)
}

object Field {
  def apply(tableName: String, c: Column): Field = {
    val ctype = PostgresMetadata.mapType(c)
    var name = if(c.name.endsWith("id") && !c.primaryKey) c.name else {
      val prefix = (if(tableName.endsWith("s")) tableName.dropRight(1) else tableName) + "_"
      c.name.replace(prefix, "")
    }
    name = (if(c.ctype == "bool") "is_" else "") + name
    name = NameMapping.toCamelCase(name)

    Field(name, ctype, c.default.flatMap(ctype.parseDefault(_)))
  }
}
