var greenmaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
var redmaterial = new THREE.LineBasicMaterial({color: 0xff0000});
var yellowmaterial = new THREE.LineBasicMaterial({color: 0xffff00});
var bluematerial = new THREE.LineBasicMaterial({color: 0x0000ff});
var blocksize = 22;

function rand(max) {
    return Math.floor(Math.random() * max);
}

function generateName(height) {
    var bignames = [
        'IBN', 'AA&T', 'Syco', 'Orange', 'Costlo', 'Bells', 'Concast', 'Bepis', 'IMD', 'DedFx'
    ];
    var bigtypes = [
        'Mall', 'Credit Union', 'Inc', 'Corp', 'Group', 'Motors', 'Health', 'Alliance', 'Technologies',
        'Insurance', 'Mutual', 'Financial', 'Telecom', 'Tower'
    ];
    var mediumnames = [
        'North', 'East', 'South', 'West', 'Adams', 'Washington', 'Lincoln',
        'Central'
    ];
    var mediumtypes = [
        'High School', 'Library', 'Post Office', 'Middle School', 'Community College',
        'Prison', 'Water Treatment Plant', 'State Office', 'Bus Station', 'Apartments'
    ];
    var smallnames = [
        'Mark\'s', 'Neighborhood', 'Annie\'s', 'Green', 'USA', 'TJ\'s', 'Artisanal', 'Organic'
    ];
    var smalltypes = [
        'Department Store', 'Dental', 'Deli', 'Video Rental', 'Coffee Shop', 'Cafe', 'Grocery',
        'Skate Shop', 'Games', 'Diner', 'Ice Cream', 'Burger Bar'
    ];
    var name = '';
    if (height > 50) {
        name += bignames[rand(bignames.length)];
        name += ' ' + bigtypes[rand(bigtypes.length)];
    }
    else if (height > 25) {
        name += mediumnames[rand(mediumnames.length)];
        name += ' ' + mediumtypes[rand(mediumtypes.length)];
    }
    else {
        name += smallnames[rand(smallnames.length)];
        name += ' ' + smalltypes[rand(smalltypes.length)];
    }
    return name;
}

// shorthand for adding vectors
function addv(v1, v2) {
    return new THREE.Vector3().addVectors(v1, v2);
}

// x, z, width, depth, height
function generateBuilding(x, z, wi, de, he) {
    wi /= 2;
    de /= 2;
    var h = new THREE.Vector3(0, he, 0);
    var p1 = new THREE.Vector3(-wi, 0, -de);
    var p2 = new THREE.Vector3(-wi, 0, de);
    var p3 = new THREE.Vector3(wi, 0, -de);
    var p4 = new THREE.Vector3(wi, 0, de);
    var points = [
        p1, p2, p3, p4,
        addv(p1, h), addv(p2, h), addv(p3, h), addv(p4, h)
    ];
    if (Math.random() > 0.8) { // Caps on some buildings
        var up = Math.floor(Math.random() * 5);
        var xin = Math.floor(Math.random() * 3);
        var zin = Math.floor(Math.random() * 3);
        var p5 = new THREE.Vector3(-wi + xin, he + up, -de + zin);
        var p6 = new THREE.Vector3(-wi + xin, he + up, de - zin);
        var p7 = new THREE.Vector3(wi - xin, he + up, -de + zin);
        var p8 = new THREE.Vector3(wi - xin, he + up, de - zin);
        points.push(p5); points.push(p6); points.push(p7); points.push(p8);
    }
    var convexgeom = new THREE.ConvexGeometry(points);
    var buildingModel = new THREE.LineSegments(new THREE.EdgesGeometry(convexgeom), greenmaterial);
    buildingModel.position.x = x;
    buildingModel.position.z = z;
    buildingModel.name = generateName(he);
    buildingModel.elec = generateElectrical(x, z, wi, de, he);
    return buildingModel;
}

function generateElectrical(x, z, wi, de, he) {
    var geom = new THREE.Geometry();
    var margin = 2;
    var level = 10;
    for (var i = 0; i < he; i += level) {
        var points = [
            new THREE.Vector3(-wi + margin, i, -de + margin),
            new THREE.Vector3(-wi + margin, i, de - margin),

            new THREE.Vector3(-wi + margin, i, de - margin),
            new THREE.Vector3(wi - margin, i, de - margin),

            new THREE.Vector3(wi - margin, i, de - margin),
            new THREE.Vector3(wi - margin, i, -de + margin),

            new THREE.Vector3(-wi + margin, i, 0),
            new THREE.Vector3(wi - margin, i, 0),

            new THREE.Vector3(0, i, de - margin),
            new THREE.Vector3(0, i, -de + margin),

            new THREE.Vector3(wi - margin, i, -de + margin),
            new THREE.Vector3(-wi + margin, i, -de + margin)
        ];
        if (i + level < he) {
            points.push(new THREE.Vector3(-wi + margin, i, 0));
            points.push(new THREE.Vector3(-wi + margin, i + level, 0));
        }

        points.forEach(function(p){geom.vertices.push(p)});
    }
    var lines = new THREE.LineSegments(geom, yellowmaterial);
    lines.position.x = x;
    lines.position.z = z;
    return lines;
}

function generateBuildings() {
    var buildings = [];
    for (var i = -150; i < 150; i += blocksize) {
        for (var j = -150; j < 150; j += blocksize) {
            if (Math.abs(i + j) > 200 ||
               (Math.abs(i - j) > 200))
                continue; // Make it circular

            if (Math.random() * 50 < 4) { // Leave some gaps
                buildings.push(null);
                continue;
            }

            var r = Math.random() * 8 + 10;
            var x = Math.random() * 6 + i - 3;
            var z = Math.random() * 6 + j - 3;
            var xz = new THREE.Vector3(x, 0, z);
            var h = Math.abs(Math.random() * 50 + 40 - xz.distanceTo(origin) / 2);
            if (h < 5)
                h = 5;
            buildings.push(generateBuilding(x, z, r, r, h));
        }
    }
    return buildings;
}

