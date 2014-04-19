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

    var projectTypes = {'Bridges': true};
    var agencies = [];
    var agencyNames = [];
    var municipalities = [];
    var users = [];
    var userNames = [];
    var reqCount = 0;
    var events = [];

    reqs = reqs.map(function (row){

        for(var column in uselessColumns) delete row[column];

        row.date = row["DATE_OCD"];
        delete row["DATE_OCD"];

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
        row.projectType = row.projectType.split("/").join(" or ")
            .split(" ")
            .map(function (s){ return s[0].toUpperCase() + s.slice(1).toLowerCase(); })
            .join(" ");
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

        var reqId = ++reqCount;
        events.push({
            reqId: reqId,
            kind: "reviseAmount",
            date: row["RECOM_DATE"] || row.date,
            content: row["AMT_REQD"] + " " + row.amount
        });
        delete row["RECOM_DATE"];
        delete row["AMT_REQD"];

        if(row["ACT_DATE1"]){
            events.push({
                reqId: reqId,
                kind: "comment",
                date: row["ACT_DATE1"] || row.date,
                content: row.REMARKS
            });
        }
        delete row["ACT_DATE1"];
        delete row.REMARKS;

        row.disasterName = row["TYPE OF DISASTER"];
        delete row["TYPE OF DISASTER"];

        if (!row.amount && row.INFRA) row.amount = row.INFRA;
        delete row.INFRA;

        return row;

    });

    function q(s){ return "'" + s + "'"; }

    document.write("--generated by csvParser.js<br/>");
    document.write("CREATE TYPE project_type AS ENUM(<br/>");
    projectTypesArray = [];
    for(var t in projectTypes) projectTypesArray.push(q(t));
    document.write(projectTypesArray.join(",<br/>") + ");;");

    document.write("<hr/>");

    document.write("--generated by csvParser.js<br/>");
    document.write(agencies.map(function (a){
        return "(" + ['DEFAULT', q(a.name), a.acronym ? q(a.acronym) : 'null', a.roleId].join(", ") + ")";
    }).join(",<br/>") + ";;");

    document.write("<hr/>");    

    document.write("--generated by csvParser.js<br/>");
    document.write("INSERT INTO municipalitys VALUES<br/>");
    document.write(municipalities.map(function (m){
        return "(" + [m.id, m.nthClass].join(", ") + ")";
    }).join(",<br/>") + ";;");

    document.write("<hr/>");

    document.write("--generated by csvParser.js<br/>");
    document.write(users.map(function (u){
        return "(" + ['DEFAULT', q(u.handle), q(u.name), u.password, u.agencyId, u.isAdmin].join(", ") + ")";
    }).join(",<br/>") + ";;");

    document.write("<hr/>");

    document.write("--generated by csvParser.js<br/>");
    document.write("INSERT INTO reqs (req_description, req_project_type, req_amount, req_date, author_id, req_location, req_disaster_date, req_disaster_name) VALUES<br/>");
    document.write(reqs.map(function (req){
        return "(" + [
            q(req.description),
            q(req.projectType),
            parseFloat(req.amount || 0).toFixed(2),
            q(req.date),
            req.authorId,
            q(req.location),
            q(req.date),
            q(req.disasterName)
        ].join(", ") + ")";
    }).join(",<br/>") + ";;");

    document.write("<hr/>");

    document.write("--generated by csvParser.js<br/>");
    document.write("INSERT INTO events VALUES<br/>")
    document.write(events.map(function (e){
        return "(" + [
            'DEFAULT',
            q(e.kind),
            q(e.date),
            q(e.content),
            e.reqId
        ].join(", ") + ")";
    }).join(",<br/>") + ";;");

});
