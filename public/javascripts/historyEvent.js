var historyEvent = {}

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
        helper.timeago(date)
      ])
    ])
  ])
}

historyEvent.comment = function(data){
  var date = new Date(data.date);
  return m(".event", [
    historyEvent.date(date),
    m(".details", [
      m("h3", "Comment"),
      m("p", data.content),
      m("p.meta", [
        "posted by ",
        m("a", {href: "/users/" + data.user.id, config: m.route}, data.user.name),
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
      m("h4.day", date.getDate()),
      m("div.year", date.getFullYear())
    ]),
    m(".divider")
  ])
}
historyEvent.calamity = function(data){
  return m(".event", [
    historyEvent.date(data.date()),
    m(".details", [
      m("h3", data.type() + " " + data.name()),
      m("p.meta", helper.timeago(data.date()))
    ]),
  ])
}
historyEvent.project = function(data){
  var pastTense = function(type){
    switch(type){
      case "POST":
        return "posted";
        break;
    }
  }
  return m(".event", [
    historyEvent.date(data.timestamp()),
    m(".details", [
      m("h3", data.title()),
      m("p", data.description()),
      m("p.meta", [
        pastTense(data.type()) + " by ",
        m("a", {href: "/user/" + data.editor().slug, config: m.route}, data.editor().name),
        helper.timeago(data.timestamp())
      ])
    ])
  ])
}
historyEvent.Event = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}
