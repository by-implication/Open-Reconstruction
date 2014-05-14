var dump = [];

function esc(s){
    return "'" + s.split("").map(function(c){
        if (c == "'") return "''";
        return c;
    }).join("") + "'";
}

var lguId = 1;
function traverse(list, level, parent){
    for(var i in list){
        var e = list[i];
        if(!e.name) continue;
        var id = lguId++;
        if(parent) dump.push({id: id, name: e.name, level: level, parent: parent});
        var children;
        switch(level){
            case 0: children = "provinces"; break;
            case 1: children = "municipalities"; break;
            case 2: children = "barangays"; break;
        }
        if(children) traverse(e[children], level + 1, id);
    }
}

bi.ajax(routes.controllers.Assets.at("data/lgu-structure-1.js")).then(function (r){
    traverse(r, 0);
    bi.ajax(routes.controllers.Assets.at("data/lgu-structure-2.js")).then(function (r){
        traverse(r, 0);
        bi.ajax(routes.controllers.Assets.at("data/lgu-structure-3.js")).then(function (r){

            traverse(r, 0, null);

            dump.sort(function (lgu1, lgu2){ return lgu1.id - lgu2.id; });

            document.write("--generated by lguParser<br/>");
            document.write(
                "INSERT INTO gov_units (gov_unit_name, role_id) VALUES<br/>" +
                dump.map(function (lgu, index){
                    return "(" + [esc(lgu.name), 1].join(", ") + ")";
                }).join(",<br/>") +
                ";;"
            );

            document.write("<hr/>");

            document.write("--generated by lguParser<br/>");
            document.write(
                "INSERT INTO lgus (lgu_id, lgu_level, parent_region_id) VALUES<br/>" +
                dump.map(function (lgu, index){
                    return "(" + [index+60, lgu.level, lgu.parent+60].join(", ") + ")";
                }).join(",<br/>") +
                ";;"
            );

        });
    });
});
