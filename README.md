Open Reconstruction
====================

[Open Reconstruction](http://openreconstruction.gov.ph) is a project headed by the [Department of Budget and Management](http://dbm.gov.ph) in partnership with [World Bank](http://www.worldbank.org.ph), in line with the [Open Data initiative](http://data.gov.ph). It aims to provide a means to NGAs/GOCCs/LGUs to easily **request for calamity funds** and keep track of the same as it goes through the **approval process**, ideally up until the **execution and implementation** of the project(s).

In addition, the site will also allow the **public** to track progress of projects and requests, **search and filter** these entries by location, type, or disaster, share these projects via social media, and leave comments on entries. **Reports, visualizations, and infographics** are also automatically generated by the system, based on real-time stats from the database.

---

## Technical Information

The Open Reconstruction system is a modern web application that follows the popular [single-page app architecture](http://en.wikipedia.org/wiki/Single-page_application). Pages are rendered in the browser by a JavaScript client, which communicates with a RESTful web backend written in Scala.


## Data Sources

(TODO -- write up about where the data came from, how we handle the data, etc.)

## Getting Started

You'll need the following services/frameworks installed on your machine or server to run your own instance of Open Recon:

* Java 6+ JDK (7 recommended)
* [Play Framework](http://playframework.com) 2.2.3
* [Redis](http://redis.io) Server
* PostgreSQL 9.3+

The following tools should be accessible on your system's PATH:

* ImageMagick (for processing user-submitted images)
* PhantomJS (for SEO/social media indexing)
* SASS compiler

OR was developed on Mac and Windows machines, but we recommend using a Mac or Linux environment. (Linux especially for production.) If you are on Linux, all of these should be easily installed via your distro's [package manager](http://en.wikipedia.org/wiki/Package_management_system), like `apt-get`, `yum`, or `pacman`. On Mac, we suggest using [Postgres.app](http://postgresapp.com/), and [Homebrew](http://brew.sh/) (`brew`) for everything else.

The client-side (in-browser) requirements are already included in the project, and dependencies are managed by [Bower](http://bower.io/). In case you are curious, we use the following libraries:

* Mithril
* Leaflet
* d3
* c3
* jQuery
* underscore
* MutationObserver
* nprogress
* select2
* Font-Awesome

# Credits and Thanks

The system was primarily designed and developed by the following, [By Implication](http://byimplication.com):

* Pepe Bawagan ([@syk0saje](http://twitter.com/syk0saje)) — back-end architecture
* Levi Tan Ong ([@levi_io](http://twitter.com/levi_io)) — front-end development, visualizations, user experience
* Albert Dizon — database schema, data architecture
* Philip Cheang ([@_phi](http://twitter.com/_phi)) — front-end design, user experience, admin / operations

We would like to thank the following people for their amazing support:

* Stella Balgos — for talking to people and making data happen
* Thomas Dy — edge-case magician, bug slayer, and overall nice guy
* Marion Banaria — pretty icons, logo, and identity
* Kenneth Yu — because nobody likes writing contracts

* Leo Horie — for Mithril, the backbone of our webapp

If you like what you see, hit us up on Twitter, like us on Facebook, or visit our website. If you want to build the next big amazing thing together, let us know.

You might also be interested in these other things we've made:

* [Sakay.ph](http://sakay.ph) — commute directions for bus, jeep, and train in Metro Manila. ([GitHub](https://github.com/sakayph))
* [Budget Badger](http://budgetbadger.ph) — track government spending, find projects near you. (GitHub)
* [Storylark](http://storylark.ph) — the best in local indie comics. Storylark compels you to visit.

By Implication and its ~~minions~~ employees are not affliated with the government, are is an independent entity. I mean, in case you were wondering.
