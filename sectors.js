var b1 = generateBuildings();
var b2 = generateBuildings();
var b3 = generateBuildings();
var b4 = generateBuildings();
var t1 = generateTransit();
var t2 = generateTransit();
var t3 = generateTransit();
var t4 = generateTransit();
var sectors = [
    {   name: "alpha",
        desc: "",
        bldg: b1,
        tran: t1
    },
    {   name: "bravo",
        desc: "",
        bldg: b2,
        tran: t2
    },
    {   name: "charlie",
        desc: "",
        bldg: b3,
        tran: t3
    },
    {   name: "delta",
        desc: "",
        bldg: b4,
        tran: t4
    }
];

function getSector(name) {
    for (var i = 0; i < sectors.length; i++)
        if (sectors[i].name === name)
            return sectors[i];

    return null;
}
