var dumps = [];

function traverse(list, level){
    for(var i in list){
        var e = list[i];
        if(!e.name) continue;
        if(!dumps[level]) dumps[level] = [];
        dumps[level].push({name: e.name, code: parseInt(e.code)});
        var children;
        switch(level){
            case 0: children = "provinces"; break;
            case 1: children = "municipalities"; break;
            case 2: children = "barangays"; break;
        }
        if(children) traverse(e[children], level + 1);
    }
}

bi.ajax(routes.controllers.Assets.at("data/lgu-structure-1.js")).then(function (r){
    traverse(r, 0);
    bi.ajax(routes.controllers.Assets.at("data/lgu-structure-2.js")).then(function (r){
        traverse(r, 0);
        bi.ajax(routes.controllers.Assets.at("data/lgu-structure-3.js")).then(function (r){
            traverse(r, 0);
            dumps[0].sort(function (r1, r2){
                return r1.code - r2.code;
            });
            for(var i in dumps[0]){
                console.log(dumps[0][i]);
            }
        });
    });
});
