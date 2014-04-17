var historyEvent = {}

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
