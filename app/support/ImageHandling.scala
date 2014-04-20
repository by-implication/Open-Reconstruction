package recon.support

import java.io.File

import scala.util.control.Exception._

import org.im4java.core._
import org.im4java.process._

import scala.util.Random

import recon.models._

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.format.Formats._
import play.api.Play.current

object ImageHandling {

	val MAXFILESIZE = current.configuration.getBytes("parsers.text.maxLength").getOrElse(3000000L) - 512 // bytes [3mb]
	val VALID_FORMATS = List("JPEG", "JPG", "PNG")
	val DEFAULT_QUALITY = 85
	val IMAGE_FORMAT = "jpg"

	val identifyFormatOperation = (new IMOperation()).format("%m").addImage()

	def generateThumbnail(a: Attachment) = {
		exifRotate(a.path)
		_resize(256, 256, a.path, Some(a.thumbPath))
	}

	private def isValidFormat(path: String): Boolean = {
		VALID_FORMATS.contains(identifyFormat(path))
	}

	private def _resize(width: Int, height: Int, inpath: String, outpath: Option[String] = None){
		var op = new IMOperation()
		op.resize(width, height)
		op.addImage(inpath)
		val cmd = outpath.map {
			o => op.addImage(o); new ConvertCmd()
		}.getOrElse(new MogrifyCmd())
		cmd.run(op)
	}

	private def exifRotate(img: String) = {
		val orientation = getExifOrientation(img)
		try {
			orientation.toInt match {
				case 8 => rotate(img, -90)
				case 3 => rotate(img, 180)
				case 6 => rotate(img, 90)
				case _ => None
			}
		} catch {
			case e: NumberFormatException => None
		}
	}

	private def getExifOrientation(name: String): String = {
		val identify = new IdentifyCmd()
		val consumer = new ArrayListOutputConsumer()
		identify.setOutputConsumer(consumer)
		catching(classOf[CommandException]).opt {
			identify.run((new IMOperation()).format("%[exif:orientation]").addImage(), name)
			val list = consumer.getOutput()
			if (list.isEmpty())
			""
			else
			list.get(0)
		}.getOrElse("")
	}

	private def identifyFormat(name: String): String = {
		val identify = new IdentifyCmd()
		val consumer = new ArrayListOutputConsumer()
		identify.setOutputConsumer(consumer)
		catching(classOf[CommandException]).opt {
			identify.run(identifyFormatOperation, name)
			val list = consumer.getOutput()
			if (list.isEmpty())
			""
			else
			list.get(0)
		}.getOrElse("")
	}

	private def rotate(img: String, degrees: Int){
		var op = new IMOperation()
		op.rotate(degrees)
		op.addImage(img)
		(new MogrifyCmd()).run(op)
		play.Logger.info("rotated " + img + " by " + degrees)
	}

}
