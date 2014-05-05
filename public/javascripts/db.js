var dictio = {};
dictio.disasters = m.prop({
  "T": "Typhoon",
  "E": "Earthquake",
  "F": "Flooding"
});

var database = {
  projectList: m.prop([]),
  userList: m.prop([]),
  projectFilters: m.prop([]),
  projectDisasters: m.prop([]),
  agencyList: m.prop([])
}

database.pull = function(){
  return bi.ajax(routes.controllers.Assets.at("data/CF14-RQST-Sanitized.csv"), {
    deserialize: function(data){
      return csv2json.csv.parse(data, function(d, i){
        // console.log(d);

        var author = {};
        var location = {};
        var disaster = {};
        var errors = [];

        // parse location
        location = {
          sitio: d.SITIO,
          town: d.TOWN,
          province: d.PROVINCE,
          barangay: d.BARANGAY,
          city: d.CITY,
          region: "REGION "+d.REG,
          "class": d.CLASS
        };

        // parse author
        switch(d.CODE){
          case "LGU":
            author = new user.LGU(d["REQUESTING PARTY"], location)
            break;
          case "NGA":
            author = new user.NGA(d["REQUESTING PARTY"], d.DEPT)
            break;
        }
        // add user to database while checking for uniqueness
        if(!database.userList().filter(function(u){return u.name === author.name}).length){
          database.userList(database.userList().concat(author));
        }

        // parse disaster
        var disasterStringArray = d["TYPE OF DISASTER"].split(" ");
        disaster = {
          name: m.prop(disasterStringArray[1]),
          type: m.prop(dictio.disasters()[disasterStringArray[0]]),
          date: m.prop(new Date(_.rest(disasterStringArray, 3).reduce(function(a, b){
            if (!a){
              return b
            } else {
              return a + " " + b
            }
          }, ""))),
          cause: m.prop(null)
        }


        // error tracking
        if(_.isEmpty(location)){
          errors.push("Unspecified Location")
        }
        if(!d["AMT_REQD"]){
          errors.push("No Amount");
        }
        if(d["NO OF PROJECTS"] > 1){
          errors.push("Multiple Projects");
        }
        if(!d["TYPE OF DISASTER"]){
          errors.push("Unspecified Disaster");
        } else if(!dictio.disasters()[disasterStringArray[0]]){
          errors.push("Unrecognized Disaster Type");
        }
        
        var p = {
          errors: errors,
          date: new Date(d.DATE_REQD),
          id: i+1,
          progress: 10,
          isRejected: false,
          disaster: disaster,
          author: author,
          location: location,
          implementingAgency: d["RECEIPIENT"],
          type: d["PURPOSE1"],
          description: d["PURPOSE"],
          amount: parseInt(d["AMT_REQD"]),
          remarks: d["REMARKS"],
          history: [new historyEvent.Event({
            editor: author,
            type: "POST",
            title: "Posted this request", 
            description: d["PURPOSE"],
            timestamp: new Date(d.DATE_REQD)
          })],
          attachments: []
        }
        return new project.Project(p);
      });
    }
  }).then(function(data){
    database.projectList(data);
    var pFilters = _.chain(database.projectList())
      .map(function(p){
        return p.type();
      })
      .unique()
      .compact()
      .value();

    var pDisasters = _.chain(database.projectList())
      .map(function(p){
        return p.disaster().type();
      })
      .unique()
      .compact()
      .value();

    var authorizedUsers = [
      {name: "Joseph Gordon Levitt", department: "OCD"},
      {name: "Ellie Goulding", department: "DPWH"}
    ]

    database.userList(
      _.chain(authorizedUsers)
      .map(function(u){
        return new user.NGA(u.name, u.department);
      })
      // .tap(function(d){
      //   console.log(d);
      // })
      .union(database.userList())
      .unique(function(u){
        return u.name;
      })
      .value()
    );

    database.projectFilters(pFilters);
    database.projectDisasters(pDisasters);

    // _.chain(database.userList())
    //   .map(function(u){
    //     console.log(u.name)
    //     return u.name
    //   })
    //   // .tap(function(d){
    //   //   console.log(d)
    //   // })
    //   .value();
    
    database.agencyList([
      new govUnit.Agency({
        shortname: "OCD",
        name: "Office of Civil Defense",
        permissions: "xxrrdd",
        userCount: 42, 
      }),
      new govUnit.Agency({
        shortname: "DPWH",
        name: "Department of Public Works and Highways",
        permissions: "xxrrdd",
        userCount: 145, 
      }),
    ]);
  });
}
