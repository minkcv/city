var material = new THREE.LineBasicMaterial({color: 0x00ff00});
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
        'Prison', 'Water Treatment Plant', 'State Office'
    ];
    var smallnames = [
        'Mark\'s', 'Neighborhood', 'Annie\'s', 'Green', 'USA'
    ];
    var smalltypes = [
        'Department Store', 'Dental', 'Deli', 'Video Rental', 'Coffee Shop', 'Cafe', 'Grocery', 'Skate Shop', 'Games'
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
    var convexgeom = new THREE.ConvexGeometry(points);
    var obj = new THREE.LineSegments(new THREE.EdgesGeometry(convexgeom), material);
    obj.position.x = x;
    obj.position.z = z;
    obj.name = generateName(he);
    return obj;
}

function generateBuildings() {
    var buildings = [];
    for (var i = -150; i < 150; i += blocksize) {
        for (var j = -150; j < 150; j += blocksize) {
            if (Math.abs(i + j) > 200 ||
               (Math.abs(i - j) > 200))
                continue; // Make it circular

            if (Math.random() * 50 < 4) // Leave some gaps
            {
                buildings.push(null);
                continue;
            }

            var r = Math.random() * 8 + 10;
            var x = Math.random() * 5 + i;
            var z = Math.random() * 5 + j;
            var xz = new THREE.Vector3(x, 0, z);
            var h = Math.abs(Math.random() * 50 + 40 - xz.distanceTo(origin) / 2);
            if (h < 5)
                h = 5;
            buildings.push(generateBuilding(x, z, r, r, h));
        }
    }
    return buildings;
}

