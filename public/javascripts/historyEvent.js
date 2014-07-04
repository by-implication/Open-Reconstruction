var historyEvent = {}

historyEvent.meta = function(verbed, data, date){
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

historyEvent.reject = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var govUnitId = c.pop();
  var govUnitName = c.join(" ");
  return m(".event", [
    m(".type.request", [
      m("i.fa.fa-lg.fa-fw.fa-times")
    ]),
    m(".details", [
      m("h3", "Rejected"),
      m("p", [
        m("a", {href: routes.controllers.GovUnits.view(govUnitId).url, config: m.route}, govUnitName),
        " rejected this request."
      ]),
      historyEvent.meta("Rejected", data, date),
    ])
  ])
}

historyEvent.archiveAttachment = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var attachmentId = c.pop();
  var filename = c.join(" ");
  return m(".event", [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-archive")
    ]),
    m(".details", [
      m("p", ["Attachment archived: " + filename].concat(
        common.attachmentActions.bind(this)({id: attachmentId, isArchived: true})
      )),
      historyEvent.meta("Archived", data, date)
    ])
  ])
}

historyEvent.editField = function(data){
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
      historyEvent.meta("Modified", data, date)
    ]),
  ]);
}

historyEvent.disaster = function(data){
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

historyEvent.newRequest = function(data){
  var date = new Date(data.date);
  return m(".event", [
    m(".type.request", [
      m("i.fa.fa-lg.fa-fw.fa-bullhorn")
    ]),
    m(".details", [
      // m("h3", "Request posted"),
      m("p", "Request posted: " + data.content),
      historyEvent.meta("Posted", data, date)
    ])
  ])
}

historyEvent.assign = function(data){
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
      historyEvent.meta(isAssign ? "Assigned" : "Unassigned", data, date)
    ])
  ])
}

historyEvent.signoff = function(data){
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
      m("h3", "Sign off"),
      m("p", [
        m("a", {href: routes.controllers.GovUnits.view(govUnitId).url, config: m.route}, govUnitName),
        (isDBM ? " assigned a SARO to and" : "") + " signed off on this request."
      ]),
      historyEvent.meta("Signed off", data, date)
    ])
  ])
}

historyEvent.attachment = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var attachmentId = c.pop();
  var filename = c.join(" ");
  return m(".event", [
    m(".type.edit", [
      m("i.fa.fa-lg.fa-fw.fa-paperclip")
    ]),
    m(".details", [
      m("p", [
        "Attachment uploaded: " + filename,
        common.attachmentActions.bind(this)({id: attachmentId})
      ]),
      historyEvent.meta("Attached", data, date)
    ])
  ])
}

historyEvent.comment = function(data){
  var date = new Date(data.date);
  return m(".event.comment", [
    m(".type.comment", [
      m("i.fa.fa-lg.fa-fw.fa-comment")
    ]),
    m(".details", [
      m("p", data.content),
      historyEvent.meta("Posted", data, date)
    ])
  ])
}

historyEvent.addProject = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var projectId = c.pop();
  var projectName = c.join(" ");
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", "New project"),
      m("p", [
        "Project " + "\""+ projectName +"\" has been added to this request."
      ]),
      historyEvent.meta("Added", data, date)
    ])
  ])
}

historyEvent.Event = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}
