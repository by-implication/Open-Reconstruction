csv2json.dsv(",", "text/plain", 1)("/assets/data/CF14-RQST-Sanitized.csv", function (data){

    var uselessColumns = {};
    var lastValue = {};
    for(var column in data[0]){
        uselessColumns[column] = true;
        lastValue[column] = data[0][column];
    }

    for(var i in data){
        for(var column in data[i]){
            if (data[i][column] != lastValue[column]) delete uselessColumns[column];
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
    var users = [];
    var agencyNames = [];
    var agencies = [];
    var roles = [];

    data = data.map(function (row){

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

        var user = row["REQUESTING PARTY"];
        row.authorId = users.indexOf(user) + 1;
        if(!row.authorId){
            users.push(user);
            row.authorId = users.length;
        }
        delete row["REQUESTING PARTY"];

        var role = row.CODE;
        var roleId = roles.indexOf(role) + 1;
        if(!roleId){
            roles.push(role);
            roleId = roles.length;
        }
        delete row.CODE;

        var agencyName = row.RECIPIENT;
        row.agencyId = agencyNames.indexOf(agencyName) + 1;
        if(!row.agencyId){
            agencyNames.push(agencyName);
            row.agencyId = agencyNames.length;
            agencies.push({
                id: row.agencyId,
                name: agencyName,
                acronym: row.DEPT,
                class: row.CLASS
            });
        }
        delete row.CLASS;
        delete row.DEPT;
        delete row.RECIPIENT;

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

    // document.write("<table border=1>");
    // document.write("<tr>");
    // for(var i in data[0]) document.write("<th>" + i + "</th>");
    // document.write("</tr>");
    // for(var i in data){
    //     document.write("<tr>");
    //     for(var j in data[i]){
    //         document.write("<td>" + data[i][j] + "</td>");
    //     }
    //     document.write("</tr>");
    // }
    // document.write("</table>");

    document.write("<h1>Project Types</h1>");
    projectTypesArray = [];
    for(var i in projectTypes) projectTypesArray.push("'" + i + "'");
    document.write(projectTypesArray.join(", "));

});
