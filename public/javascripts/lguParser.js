var dump = [];

function esc(s){
    return "'" + s.split("").map(function(c){
        if (c == "'") return "''";
        return c;
    }).join("") + "'";
}

var lguId = 61;
var regions = [
    null,
    "REGION I (ILOCOS REGION)",
    "REGION II (CAGAYAN VALLEY)",
    "REGION III (CENTRAL LUZON)",
    "REGION IV-A (CALABARZON)",
    "REGION V (BICOL REGION)",
    "REGION VI (WESTERN VISAYAS)",
    "REGION VII (CENTRAL VISAYAS)",
    "REGION VIII (EASTERN VISAYAS)",
    "REGION IX (ZAMBOANGA PENINSULA)",
    "REGION X (NORTHERN MINDANAO)",
    "REGION XI (DAVAO REGION)",
    "REGION XII (SOCCSKSARGEN)",
    "NATIONAL CAPITAL REGION (NCR)",
    "CORDILLERA ADMINISTRATIVE REGION (CAR)",
    "AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)",
    "REGION XIII (Caraga)",
    "REGION IV-B (MIMAROPA)"
];

function traverse(list, level, code){

    level = level || 0;
    code = code || "";

    list.forEach(function (e){

        if(!e.name) return;

        var id;
        var newCode;
        if(code){
            id = lguId++;
            newCode = code + "." + e.code;
            dump.push({id: id, name: e.name, level: level, code: newCode});
        } else {
            id = regions.indexOf(e.name);
            newCode = id;
        }

        var children;
        switch(level){
            case 0: children = "provinces"; break;
            case 1: children = "municipalities"; break;
            case 2: children = "barangays"; break;
        }

        // if(!level){
        //     console.log(e.name + ": " + e[children].map(function(c){ return c.name; }).join(", "))
        // }

        if(children) traverse(e[children], level + 1, newCode);

    })
}

bi.ajax(routes.controllers.Assets.at("data/lgu-structure-1.js")).then(function (r){
    traverse(r);
    bi.ajax(routes.controllers.Assets.at("data/lgu-structure-2.js")).then(function (r){
        traverse(r);
        bi.ajax(routes.controllers.Assets.at("data/lgu-structure-3.js")).then(function (r){

            traverse(r);

            dump.sort(function (lgu1, lgu2){ return lgu1.id - lgu2.id; });

            var name = "lgus.csv";
            var content = dump.map(function (lgu, index){
                return [
                    lgu.id,
                    lgu.level,
                    '',
                    lgu.code
                ].join(",");
            }).join("\n");

            saveAs(new Blob([content]), name);

        });
    });
});
