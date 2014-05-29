var historyEvent = {}

historyEvent.meta = function(verbed, data, date){
  return m("p.meta", [
    verbed,
    " by ",
    m("a", {href: routes.controllers.Users.view(data.user.id).url, config: m.route}, data.user.name),
    ", of ",
    m("a", {href: routes.controllers.GovUnits.view(data.govUnit.id).url, config: m.route}, data.govUnit.name),
    " ",
    helper.timeago(date)
  ])
}

historyEvent.reject = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var govUnitId = c.pop();
  var govUnitName = c.join(" ");
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", "Rejected"),
      m("p", [
        m("a", {href: routes.controllers.GovUnits.view(govUnitId).url, config: m.route}, govUnitName),
        " rejected this project."
      ]),
      historyEvent.meta("Rejected", data, date)
    ])
  ])
}

historyEvent.archiveAttachment = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var attachmentId = c.pop();
  var isImage = parseInt(c.pop());
  var filename = c.join(" ");
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("p", [(isImage ? "Image" : "Document") + " archived: " + filename].concat(
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
  var value;
  switch(field){
    case "disaster": {
      var ddate = parseInt(c.pop());
      var typeId = c.pop();
      var name = c.join(" ");
      value = name + " (" + request.disasterTypes()[typeId].name + ") on " + common.displayDate(ddate);
      break;
    }
    default: value = c.join(" ");
  }
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("p", "Project " + field + " was set to \"" + value + "\""),
      historyEvent.meta("Modified", data, date)
    ]),
  ]);
}

historyEvent.disaster = function(data){
  var date = new Date(data.date);
  var c = data.content.split(":");
  var disasterType = c.pop();
  var disasterName = c.join(":");
  var title = disasterName ? (disasterName + " (" + disasterType + ")") : disasterType
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("p", title),
      m("p.meta", helper.timeago(date))
    ]),
  ])
}

historyEvent.newRequest = function(data){
  var date = new Date(data.date);
  return m(".event", [
    historyEvent.date(date),
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
    historyEvent.date(date),
    m(".details", [
      m("p", isAssign ? [
        m("a", {href: routes.controllers.GovUnits.view(govUnitId).url, config: m.route}, govUnitName),
        " was assigned" + prepPhrase + " this project."
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
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", "Sign off"),
      m("p", [
        m("a", {href: routes.controllers.GovUnits.view(govUnitId).url, config: m.route}, govUnitName),
        " signed off on this project."
      ]),
      historyEvent.meta("Signed off", data, date)
    ])
  ])
}

historyEvent.attachment = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var attachmentId = c.pop();
  var isImage = parseInt(c.pop());
  var filename = c.join(" ");
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("p", [
        (isImage ? "Image" : "Document") + " uploaded: " + filename,
        common.attachmentActions.bind(this)({id: attachmentId})
      ]),
      historyEvent.meta("Attached", data, date)
    ])
  ])
}

historyEvent.comment = function(data){
  var date = new Date(data.date);
  return m(".event.comment", [
    m(".details", [
      m("p", data.content),
      historyEvent.meta("Posted", data, date)
    ])
  ])
}

historyEvent.date = function(date){
  return m(".dateGroup", [
    m(".date", [
      m("div.month", helper.monthArray[date.getMonth()]),
      m("h5.day", date.getDate()),
      m("div.year", date.getFullYear())
    ]),
    m(".divider")
  ])
}

historyEvent.assignSaro = function(data){
  var date = new Date(data.date);
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", "SARO assignment"),
      m("p", [
        "A SARO has been assigned to this request."
      ]),
      historyEvent.meta("Assigned ", data, date)
    ])
  ])
}

historyEvent.Event = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}
