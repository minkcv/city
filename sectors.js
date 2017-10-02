var b1 = generateBuildings();
var b2 = generateBuildings();
var b3 = generateBuildings();
var b4 = generateBuildings();
var sectors = [
    {   name: "alpha",
        desc: "",
        bldg: b1,
        mech: [],
        elec: [],
        plmb: []
    },
    {   name: "bravo",
        desc: "",
        bldg: b2,
        mech: [],
        elec: [],
        plmb: []
    },
    {   name: "charlie",
        desc: "",
        bldg: b3,
        mech: [],
        elec: [],
        plmb: []
    },
    {   name: "delta",
        desc: "",
        bldg: b4,
        mech: [],
        elec: [],
        plmb: []
    }
];

function getSector(name) {
    for (var i = 0; i < sectors.length; i++)
        if (sectors[i].name === name)
            return sectors[i];

    return null;
}
