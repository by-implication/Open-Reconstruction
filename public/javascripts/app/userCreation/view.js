/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

userCreation.view = function(ctrl){
  return app.template(ctrl.app, "New User", [
    common.banner("Adding users for " + ctrl.govUnit().name),
    m("section", [
      m(".row", [
        m(".columns.medium-12", [
          m("form", {onsubmit: ctrl.submit}, [
            m("ul", ctrl.entries.map(function(entry, index){
              return m("li.new-user", [
                m(".row", [
                  m(".columns.medium-12", [
                    m("button.alert[type=button].tiny.radius.right", {onclick: entry.remove}, [
                      m("i.fa.fa-fw.fa-lg.fa-times")
                    ]),
                    m("h3", [
                      "User " + (index + 1)
                    ]),
                  ]),
                ]),
                m(".row", [
                  m(".columns.medium-4", [
                    common.field(
                      "Full Name",
                      m("input[type='text']", {value: entry.name(), onchange: m.withAttr("value", entry.name), placeholder: "e.g., Juan Carlos Dizon de Guzman"})
                    ),
                  ]),
                  m(".columns.medium-3", [
                    common.field(
                      "Username",
                      m("input[type='text']", {value: entry.handle(), onchange: m.withAttr("value", entry.handle)}),
                      "The pattern should be [first initial][middle initial][surname]. For example, Juan Carlos Dizon de Guzman should be jddeguzman.",
                      true
                    ),
                  ]),
                  m(".columns.medium-3", [
                    common.field(
                      "Password",
                      m("input[type='password']", {value: entry.password(), onchange: m.withAttr("value", entry.password)})
                    ),
                  ]),
                  m(".columns.medium-2", [
                    common.field(
                      "Privileges",
                      m("label", [
                        m("input[type='checkbox']", {checked: entry.isAdmin(), onchange: m.withAttr("checked", entry.isAdmin)},""),
                        m("span", "Make this user an admin for this agency")
                      ]),
                      "As an admin, this user will be able to add and delete users",
                      true
                    ),
                  ]),
                ])
              ]);
            })),
            m(".row", [
              m(".columns.medium-12", [
                m("button", {type: "button", onclick: ctrl.newEntry}, "Add new entry"),
              ]),
            ]),
            m(".row", [
              m(".columns.medium-12", [
                m("button", "Submit")
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}