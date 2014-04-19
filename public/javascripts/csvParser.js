csv2json.dsv(",", "text/plain", 1)("/assets/data/CF14-RQST-Sanitized.csv", function (reqs){

    var uselessColumns = {};
    var lastValue = {};
    for(var column in reqs[0]){
        uselessColumns[column] = true;
        lastValue[column] = reqs[0][column];
    }

    for(var i in reqs){
        for(var column in reqs[i]){
            if (reqs[i][column] != lastValue[column]) delete uselessColumns[column];
        }
    }

    [
        "ACT_TAKEN1",
        "INDORSED BY",
        "CFMU_C1",
        "CFMU_C2",
        "DISTRICT",
        "NO OF PROJECTS",
        "REM_DEPT",
        "UPDATE",
        "YEAR",
        "CMONTH",
        "IND_DATE",
        "DATE_REQD"
    ].forEach(function (x){ uselessColumns[x] = true; });

    var projectTypes = {'BRIDGES': true};
    var agencies = [];
    var agencyNames = [];
    var municipalities = [];
    var users = [];
    var userNames = [];

    reqs = reqs.map(function (row){

        for(var column in uselessColumns) delete row[column];

        row.location = [row.BARANGAY, row.TOWN, row.CITY, row.PROVINCE].filter(function (field){
            return field && field.length;
        }).join(", ");

        if(row.REG){
            if(row.location){
                row.location += ", Region " + row.REG;
            } else {
                row.location = "Region " + row.REG;
            }
        }

        delete row.BARANGAY;
        delete row.TOWN;
        delete row.CITY;
        delete row.PROVINCE;
        delete row.REG;

        row.description = row.PURPOSE;
        delete row.PURPOSE;

        row.projectType = row.PURPOSE1 || "OTHERS";
        if(row.projectType == "FA") row.projectType = "FINANCIAL AID";
        if(row.projectType == "ROADS/BRIDGES") row.projectType = "ROADS";
        projectTypes[row.projectType] = true;
        delete row.PURPOSE1;

        var roleId;
        switch(row.CODE){
            case 'LGU': roleId = 1; break;
            case 'OCD': roleId = 2; break;
            case 'OP': roleId = 3; break;
            case 'DPWH': roleId = 4; break;
            case 'DBM': roleId = 5; break;
            case 'NGA': roleId = 6; break;
        }
        delete row.CODE;

        var agencyName = row.RECIPIENT;
        var agencyId = agencyNames.indexOf(agencyName) + 1;
        if(!agencyId){
            agencyNames.push(agencyName);
            agencyId = agencyNames.length + 5;
            agencies.push({
                id: agencyId,
                name: agencyName,
                acronym: row.DEPT,
                roleId: roleId
            });
            if(row.CLASS){
                municipalities.push({
                    id:  agencyId,
                    nthClass: parseInt(row.CLASS)
                });
            }
        } else {
            agencyId += 5;
        }
        delete row.CLASS;
        delete row.DEPT;
        delete row.RECIPIENT;

        var userName = row["REQUESTING PARTY"];

        function sanitize(fullName){
            return fullName.trim().split(" ")
                .map(function (s){
                    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                }).map(function (s){
                    return s.length - 1 ? s : s + ".";
                }).map(function (s){
                    return ["Cong", "Gov", "Brgy", "Usec", "Sec", "Ms", "Mr"].indexOf(s) + 1 ? s + "." : s;
                }).join(" ");
        }

        function isNotTitle(segment){
            return ['mayor', 'gov', 'brgy', 'captain', 'usec', 'cong', 'mr', 'ms', 'chairman', 'jr', 'sr', 'sec']
                .indexOf(segment) == -1;
        }

        function getHandle(fullName){
            var s = fullName.trim().split(" ")
                .map(function (s){
                    return s.toLowerCase().split(".").join(""); })
                .filter(isNotTitle)
            return s[0][0] + s[1][0] + s[s.length-1];
        }

        row.authorId = userNames.indexOf(userName) + 1;
        if(!row.authorId){
            userNames.push(userName);
            row.authorId = userNames.length + 5;
            users.push({
                id: row.authorId,
                handle: getHandle(userName),
                name: sanitize(userName),
                password: "crypt('password', gen_salt('bf'))",
                agencyId: agencyId,
                isAdmin: false,
            });
        } else {
            row.authorId += 5;
        }
        delete row["REQUESTING PARTY"];

        row.amount = row["AMT_RECOM"];
        delete row["AMT_RECOM"];

        row.history = [{
            "event": "reviseAmount",
            "date": row["RECOM_DATE"],
            "old" : row["AMT_REQD"],
            "new" : row.amount
        }];
        delete row["RECOM_DATE"];
        delete row["AMT_REQD"];

        if(row["ACT_DATE1"]){
            row.history.push({
                "event": "comment",
                "date": row["ACT_DATE1"],
                "content": row.REMARKS
            });
        }
        delete row["ACT_DATE1"];
        delete row.REMARKS;

        row.disasterName = row["TYPE OF DISASTER"];
        delete row["TYPE OF DISASTER"];

        if (!row.amount && row.INFRA) row.amount = row.INFRA;
        delete row.INFRA;

        row.date = row["DATE_OCD"];
        delete row["DATE_OCD"];

        return row;

    });

    document.write("<h1>Requests</h1>");
    for(var i in reqs){
        document.write(JSON.stringify(reqs[i]) + "<br/>");
    }

    // document.write("<h1>Users</h1>");
    // users.forEach(function (u){
    //     document.write("(" + [u.id, q(u.handle), q(u.name), u.password, u.agencyId, u.isAdmin].join(", ") + "),<br/>");
    // });

    // document.write("<h1>Project Types</h1>");
    // projectTypesArray = [];
    // for(var i in projectTypes) projectTypesArray.push("'" + i + "'");
    // document.write(projectTypesArray.join(", "));

    // function q(s){ return "'" + s + "'"; }
    // document.write("<h1>Agencies</h1>");
    // agencies.forEach(function (a){
    //     document.write("(" + [a.id, q(a.name), a.acronym ? q(a.acronym) : 'null', a.roleId].join(", ") + "),<br/>");
    // });

    // document.write("<h1>Municipalities</h1>");
    // municipalities.forEach(function (m){
    //     document.write("(" + [m.id, m.nthClass].join(", ") + "),<br/>");
    // });

});
