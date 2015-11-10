/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

faq.view = function(ctrl){
  return app.template(ctrl.app, "Home", [
    m("section.banner", [
      m(".row", [
        m(".columns.medium-12", [
          m("div#logo"),
          m("h1", "FAQ"),
          m("p", [
            "Frequently Asked Questions"
          ])
        ]),
      ])
    ]),
    m("section", [
      m(".row", [
        common.stickyTabs.menu(ctrl.faqTabs, {className: "vertical", config: common.stickyTabs.config(ctrl.faqTabs)}),
        m(".tabs-content.vertical", [
          m("ul#faq", [
            m("li.q#what-site", [
              m("h2", [
                "What is Open Reconstruction?"
              ]),
              m("p", [
                "Open Reconstruction is a website that allows the public to track reconstruction projects after disasters such as the Bohol Earthquake and Typhoon Yolanda. It gives the public access to important post-disaster information: project requests by affected government units, financing by the national government, and statistics for both."
              ]),
              m("p", [
                "It also provides national government agencies (NGAs), Government Owned and Controlled Corporations (GOCCs) and Local Government Units (LGUs) with a more efficient process for submitting and processing reconstruction project requests. "
              ]),
            ]),
            m("li.q#what-track", [
              m("h2", [
                "What will be tracked?"
              ]),
              m("p", [
                "Initially the site will track only the DPWH-related project proposal submissions, budget releases (Special Allotment Release Orders, SAROs) for the approved requests, and project level implementation. The latter will include procurement, physical and financial implementation, geo-tagging, and public feedback content as the site is developed."
              ]),
              m("p", [
                "Moving forward, the site will expand to track project implementation for other agencies (like DSWD and DepEd). The site will initially focus on reconstruction for the Bohol Earthquake and Typhoon Yolanda, but it can handle future disasters."
              ]),
              m("p", [
                "Local calamity fund spending details are outside of the scope of Open Reconstruction."
              ]),
              m("p", [
                "Donor contributions will not be tracked by this system. Instead, our sister site, the Foreign Aid Transparency Hub (FAiTH), will perform this function."
              ]),
            ]),
            m("li.q#what-request", [
              m("h2", [
                "What is the difference between a request and a project?"
              ]),
              m("p", [
                "A request is what it sounds like: a call for the national government’s assistance after a disaster."
              ]),
              m("p", [
                "A project, on the other hand, is taken from implementing agencies’ project management systems (PMS) as they work on a request. Because it is up to the implementing agencies’ workflow to decide how to break down a request into manageable chunks, a single request can refer to several projects. "
              ]),
              m("p", [
                "Projects are expected to conform to the government’s new Unified Account Code Structure (UACS), which sets the basis for government budgeting, accounting, reporting and audit. The UACS also forms the basis for breaking down lump sum budgets into specific line items, notably those that require SARO for releases."
              ]),
            ]),
            m("li.q#why-dpwh", [
              m("h2", [
                "Why is Open Reconstruction currently limited to DPWH projects?"
              ]),
              m("p", [
                "The DPWH already has an operational system for the reporting of project information and monitoring the progress of implementation — the electronic Project Life Cycle (ePLC) system. The ePLC provides an existing platform which can be readily linked to the Open Reconstruction database, which is still on its trial stage."
              ]),
              m("p", [
                "The ePLC, though still being refined, will eventually serve as the model for future efforts to link, synchronize, and standardize all succeeding project monitoring platforms within the government."
              ]),
              m("p", [
                "In the future, we hope to make Open Reconstruction support projects implemented by other agencies and department."
              ]),
            ]),
            m("li.q#how-implement", [
              m("h2", [
                "How will requests be implemented?"
              ]),
              m("p", [
                "Initial training sessions for the mandated use of the website will be conducted with appointed agencies, namely the Office of Civil Defence/National Disaster Risk Reduction and Management Council (OCD/NDRRMC), the DPWH, the Office of the President (OP), and the DBM, in the interim. "
              ]),
              m("p", [
                "Request submission will be limited to selected administrative users for:"
              ]),
              m("ol", [
                m("li", [
                  "regional offices for NGAs"
                ]),
                m("li", [
                  "national offices for GoCCs"
                ]),
                m("li", [
                  "provincial and city-municipal governments"
                ]),
              ]),
              m("br"),
              m("p", [
                "LGUs with weak IT capacity will be partnered with provincial or regional NGA offices to allow for online submission. These stakeholders will be first asked to see if their requests are already in the existing request database, before submitting."
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ]);
}