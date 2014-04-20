var historyEvent = {}

historyEvent.disaster = function(data){
  var date = new Date(data.date);
  var c = data.content.split(":");
  var disasterType = c.pop();
  var disasterName = c.join(":");
  var title = disasterName ? (disasterName + " (" + disasterType + ")") : disasterType
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", title),
      m("p.meta", helper.timeago(date))
    ]),
  ])
}

historyEvent.newRequest = function(data){
  var date = new Date(data.date);
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", "Request posted"),
      m("p", data.content),
      m("p.meta", [
        "posted by ",
        m("a", {href: "/user/" + data.user.id, config: m.route}, data.user.name),
        " ",
        helper.timeago(date)
      ])
    ])
  ])
}

historyEvent.assign = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var duty = c.pop()
  var cduty = duty.split("");
  cduty[0] = cduty[0].toUpperCase();
  cduty = cduty.join("");
  var isAssign = parseInt(c.pop());
  var agencyId = c.pop();
  var agencyName = c.join(" ");

  var assignment = isAssign ? "assigned" : "unassigned";
  var prepPhrase = isAssign ? " to " + duty : " from " + duty + "ing"

  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      // m("h3", cduty + "ing Agency " + assignment),
      m("p", [
        m("a", {href: "/agencies/" + agencyId}, agencyName),
        " was " + assignment + prepPhrase + " this project."
      ]),
      m("p.meta", [
        "assigned by ",
        m("a", {href: "/users/" + data.user.id, config: m.route}, data.user.name),
        " ",
        helper.timeago(date)
      ])
    ])
  ])
}

historyEvent.signoff = function(data){
  var date = new Date(data.date);
  var c = data.content.split(" ");
  var agencyId = c.pop();
  var agencyName = c.join(" ");
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", "Sign off"),
      m("p", [
        m("a", {href: "/agencies/" + agencyId}, agencyName),
        agencyName == "Department of Budget and Management" ?
        " has approved a SARO for this project." : " signed off on this project."
      ]),
      m("p.meta", [
        "signed off by ",
        m("a", {href: "/users/" + data.user.id, config: m.route}, data.user.name),
        " ",
        helper.timeago(date)
      ])
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
      m("h3", isImage ? "Image" : "Document"),
      m("p", [
        filename,
        m("a", {title: "Preview", href: "/attachments/" + attachmentId + "/preview"}, [
          m("i.fa.fa-lg.fa-eye.fa-fw"),
        ]),
        m("a", {title: "Download", href: "/attachments/" + attachmentId + "/download"}, [
          m("i.fa.fa-lg.fa-download.fa-fw"),
        ]),
      ]),
      m("p.meta", [
        "attached by ",
        m("a", {href: "/users/" + data.user.id, config: m.route}, data.user.name),
        " ",
        helper.timeago(date)
      ])
    ])
  ])
}

historyEvent.comment = function(data){
  var date = new Date(data.date);
  return m(".event.comment", [
    // historyEvent.date(date),
    m(".details", [
      // m("h3", "Comment"),
      m("p", data.content),
      m("p.meta", [
        "posted by ",
        m("a", {href: "/users/" + data.user.id, config: m.route}, data.user.name),
        " ",
        helper.timeago(date)
      ])
    ])
  ])
}

historyEvent.reviseAmount = function(data){
  var date = new Date(data.date);
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", "Amount Revised"),
      m("p", "From " + data.content.split(" ")
        .map(function (amt){ return "PHP " + amt; })
        .join(" to ")),
      m("p.meta", [
        "changed by ",
        user ? "unknown" :
        m("a", {href: "/users/" + data.user.id, config: m.route}, data.user.name),
        helper.timeago(date)
      ])
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

historyEvent.Event = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}
