var feedEvent = {}

feedEvent.meta = function(verbed, data, date){
  return m("p.meta", [
    helper.timeago(date),
    " on, ",
    date.toDateString()
  ])
}

feedEvent.reject = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var govUnitId = c.pop();
  var govUnitName = c.join(" ");
  return m("a.event", {
    href: routes.controllers.Requests.view(data.req.id).url,
    className: data.isNew ? ".new" : ""
  }, [
    m(".type.request", [
      m("i.fa.fa-lg.fa-fw.fa-times")
    ]),
    m(".details", [
      m("h6", [
        m("strong", data.user.name),
        " rejected ",
        m("strong", data.req.description)
      ]),
      feedEvent.meta("Rejected", data, date),
    ])
  ])
}

feedEvent.archiveAttachment = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var attachmentId = c.pop();
  var filename = c.join(" ");
  return m("a.event", {href: routes.controllers.Requests.view(data.req.id).url}, [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-archive")
    ]),
    m(".details", [
      m("h6", [
        m("strong", data.user.name),
        " archived ",
        m("strong", filename)
      ]),
      feedEvent.meta("Archived", data, date)
    ])
  ])
}

feedEvent.editField = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var field = c.pop();
  var value = c.join(" ");
  return m("a.event", {href: routes.controllers.Requests.view(data.req.id).url}, [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-edit")
    ]),
    m(".details", [
      m("h6", [
        m("strong", data.user.name),
        " set the ",
        field,
        " of ",
        m("strong", data.req.description + "'s"),
        " to ",
        m("strong", value)
      ]),
      feedEvent.meta("Modified", data, date)
    ]),
  ]);
}

feedEvent.newRequest = function(data){
  var date = new Date(data.date);
  return m("a.event", {href: routes.controllers.Requests.view(data.req.id).url}, [
    m(".type.request", [
      m("i.fa.fa-lg.fa-fw.fa-bullhorn")
    ]),
    m(".details", [
      m("h6", [
        m("strong", data.user.name),
        " made a new request: ",
        m("strong", data.req.description)
      ]),
      feedEvent.meta("Posted", data, date)
    ])
  ])
}

feedEvent.assign = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var duty = c.pop();
  var cduty = duty.split("");
  cduty[0] = cduty[0].toUpperCase();
  cduty = cduty.join("");
  var isAssign = parseInt(c.pop());
  var govUnitId = isAssign;
  var govUnitName = c.join(" ");

  var prepPhrase = isAssign ? " to " + duty : " from " + duty + "ing"

  return m("a.event", {href: routes.controllers.Requests.view(data.req.id).url}, [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-mail-forward")
    ]),
    m(".details", [
      isAssign ?
        m("h6", [
          m("strong", data.govUnit.name),
          " assigned ",
          m("strong", govUnitName),
          " " + prepPhrase + " ",
          m("strong", data.req.description),
        ])
      : m("h6", [
          m("strong", data.govUnit.name),
          " unassigned " + duty.capitalize() + "ing agency"
        ]),
      feedEvent.meta(isAssign ? "Assigned" : "Unassigned", data, date)
    ])
  ])
}

feedEvent.signoff = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var govUnitId = c.pop();
  var govUnitName = c.join(" ");
  var isDBM = govUnitName == "Department of Budget and Management";
  return m("a.event", {href: routes.controllers.Requests.view(data.req.id).url}, [
    m(".type.request", [
      isDBM ? m("i.fa.fa-lg.fa-fw.fa-money") : m("i.fa.fa-lg.fa-fw.fa-check")
    ]),
    m(".details", [
      m("h6", [
        m("strong", govUnitName),
        " signed off on ",
        m("strong", data.req.description)
      ]),
      feedEvent.meta("Signed off", data, date)
    ])
  ])
}

feedEvent.attachment = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var attachmentId = c.pop();
  var filename = c.join(" ");
  return m("a.event", {href: routes.controllers.Requests.view(data.req.id).url}, [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-paperclip")
    ]),
    m(".details", [
      m("h6", [
        m("strong", data.user.name),
        " uploaded an attachment: ",
        m("strong", filename)
      ]),
      feedEvent.meta("Attached", data, date)
    ])
  ])
}

feedEvent.comment = function(data){
  var date = new Date(data.date);
  return m("a.event.comment",
    {
      href: routes.controllers.Requests.view(data.req.id).url,
      className: data.isNew ? ".new" : ""
    },
    [
      m(".type.comment", [
        m("i.fa.fa-lg.fa-fw.fa-comment")
      ]),
      m(".details", [
        m("h6", [
          m("strong", data.user.name),
          " commented on ",
          m("strong", data.req.description),
          ":"
        ]),
        m("p", data.content),
        feedEvent.meta("Posted", data, date)
      ])
    ]
  )
}

feedEvent.addProject = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var projectId = c.pop();
  var projectName = c.join(" ");
  return m("a.event", {href: routes.controllers.Requests.view(data.req.id).url}, [
    m(".type.comment", [
      m("i.fa.fa-lg.fa-fw.fa-plus")
    ]),
    m(".details", [
      m("h6", [
        m("strong", data.user.name),
        " referenced ",
        m("strong", "\"" + projectName + "\""),
        " in ",
        m("strong", data.req.description)
      ]),
      feedEvent.meta("Added", data, date)
    ])
  ])
}
