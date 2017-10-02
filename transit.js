function generateTransit() {
    var roads = [];
    var hs = blocksize / 2; // Half size
    for (var i = -150; i < 150; i += blocksize) {
        for (var j = -150; j < 150; j += blocksize) {
            if (Math.abs(i + j) > 200 ||
               (Math.abs(i - j) > 200))
                continue; // Make it circular

            var points = [
                new THREE.Vector3(-hs, 0, -hs),
                new THREE.Vector3(hs, 0, -hs),
                new THREE.Vector3(hs, 0, -hs),
                new THREE.Vector3(hs, 0, hs),
                new THREE.Vector3(hs, 0, hs),
                new THREE.Vector3(-hs, 0, hs),
                new THREE.Vector3(-hs, 0, hs),
                new THREE.Vector3(-hs, 0, -hs),
            ]
            var geom = new THREE.Geometry();
            points.forEach(function(p){geom.vertices.push(p)});
            var lines = new THREE.LineSegments(geom, material);
            lines.position.x = i;
            lines.position.z = j;
            roads.push(lines);
        }
    }
    return roads;
}