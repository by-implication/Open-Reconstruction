package controllers

import play.api._
import play.api.mvc._
import recon.models._
import recon.support._

object Visualizations extends Controller with Secured {

  def view(v: String) = Application.index

}
