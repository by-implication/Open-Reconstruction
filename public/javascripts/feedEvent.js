var feedEvent = {}

feedEvent.meta = function(verbed, data, date){
  return m("p.meta", [
    verbed,
    " by ",
    m("a", {href: routes.controllers.Users.view(data.user.id).url, config: m.route}, data.user.name),
    ", of ",
    m("a", {href: routes.controllers.GovUnits.view(data.govUnit.id).url, config: m.route}, data.govUnit.name),
    " ",
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
  return m(".event", [
    m(".type.request", [
      m("i.fa.fa-lg.fa-fw.fa-times")
    ]),
    m(".details", [
      m("p", [
        m("a", {href: routes.controllers.GovUnits.view(govUnitId).url, config: m.route}, govUnitName),
        " rejected this request."
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
  return m(".event", [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-archive")
    ]),
    m(".details", [
      m("p", ["Attachment archived: " + filename]),
      feedEvent.meta("Archived", data, date)
    ])
  ])
}

feedEvent.editField = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var field = c.pop();
  var value = c.join(" ");
  return m(".event", [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-edit")
    ]),
    m(".details", [
      m("p", "Request " + field + " was set to \"" + value + "\""),
      feedEvent.meta("Modified", data, date)
    ]),
  ]);
}

feedEvent.disaster = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var disasterTypeId = c.pop();
  var disasterType = request.getDTbyId(disasterTypeId);
  var disasterName = c.join(" ");
  var title = disasterName ? (disasterName + " (" + disasterType.name + ")") : disasterType.name
  return m(".event", [
    m(".type.disaster", [
      m("i.fa.fa-lg.fa-fw.fa-warning")
    ]),
    m(".details", [
      m("p", title),
      m("p.meta", helper.timeago(date))
    ]),
  ])
}

feedEvent.newRequest = function(data){
  var date = new Date(data.date);
  return m(".event", [
    m(".type.request", [
      m("i.fa.fa-lg.fa-fw.fa-bullhorn")
    ]),
    m(".details", [
      m("p", "Request posted: " + data.content),
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

  return m(".event", [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-mail-forward")
    ]),
    m(".details", [
      m("p", isAssign ? [
        m("a", {href: routes.controllers.GovUnits.view(govUnitId).url, config: m.route}, govUnitName),
        " was assigned" + prepPhrase + " this request."
      ] : duty.capitalize() + "ing agency was unassigned."),
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
  return m(".event", [
    m(".type.request", [
      isDBM ? m("i.fa.fa-lg.fa-fw.fa-money") : m("i.fa.fa-lg.fa-fw.fa-check")
    ]),
    m(".details", [
      m("p", [
        m("a", {href: routes.controllers.GovUnits.view(govUnitId).url, config: m.route}, govUnitName),
        (isDBM ? " assigned a SARO to and" : "") + " signed off on this request."
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
  return m(".event", [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-paperclip")
    ]),
    m(".details", [
      m("p", ["Attachment uploaded: " + filename]),
      feedEvent.meta("Attached", data, date)
    ])
  ])
}

feedEvent.comment = function(data){
  var date = new Date(data.date);
  return m("a.event.comment" + (data.isNew ? ".new" : ""),
    {href: routes.controllers.Requests.view(data.req.id).url},
    [
      m(".type.comment", [
        m("i.fa.fa-lg.fa-fw.fa-comment")
      ]),
      m(".details", [
        "Request #" + data.req.id + ": " + data.req.description,
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
  return m(".event", [
    feedEvent.date(date),
    m(".details", [
      m("p", [
        "Project " + "\""+ projectName +"\" has been added to this request."
      ]),
      feedEvent.meta("Added", data, date)
    ])
  ])
}
