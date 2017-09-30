var sectors = [
    {   name: "alpha",
        desc: "",
        bldg: [],
        mech: [],
        elec: [],
        plmb: []
    },
    {   name: "bravo",
        desc: "",
        bldg: [],
        mech: [],
        elec: [],
        plmb: []
    },
    {   name: "charlie",
        desc: "",
        bldg: [],
        mech: [],
        elec: [],
        plmb: []
    },
    {   name: "delta",
        desc: "",
        bldg: [],
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
