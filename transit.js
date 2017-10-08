function generateTransit() {
    var streets = [];
    var hs = blocksize / 2; // Half size
    var lightHeight = 6;
    var streetNumbers = [ '1st', '2nd', '3rd'];
    for (var i = 4; i < 300 / blocksize + 1; i++) {
        streetNumbers.push(i + 'th');
    }
    var streetNames = ['Albion', 'Birch', 'Chestnut', 'Delaware', 'Eleanor', 'France', 'Georgia', 'High', 'Illinois', 'Josephine', 'Kearny', 'Limon', 'Monroe', 'Nebraska'];
    for (var i = -150; i < 150; i += blocksize) {
        for (var j = -150; j < 150; j += blocksize) {
            if (Math.abs(i + j) > 200 ||
               (Math.abs(i - j) > 200))
                continue; // Make it circular

            var points = [
                // Box
                new THREE.Vector3(-hs, 0, -hs),
                new THREE.Vector3(hs, 0, -hs),
                new THREE.Vector3(hs, 0, -hs),
                new THREE.Vector3(hs, 0, hs),
                new THREE.Vector3(hs, 0, hs),
                new THREE.Vector3(-hs, 0, hs),
                new THREE.Vector3(-hs, 0, hs),
                new THREE.Vector3(-hs, 0, -hs),

                // Traffic lignts
                new THREE.Vector3(-hs, 0, -hs),
                new THREE.Vector3(-hs, lightHeight, -hs),
                new THREE.Vector3(-hs, lightHeight, -hs),
                new THREE.Vector3(-hs - 2, lightHeight, -hs),

                new THREE.Vector3(hs, 0, -hs),
                new THREE.Vector3(hs, lightHeight, -hs),
                new THREE.Vector3(hs, lightHeight, -hs),
                new THREE.Vector3(hs, lightHeight, -hs - 2),

                new THREE.Vector3(-hs, 0, hs),
                new THREE.Vector3(-hs, lightHeight, hs),
                new THREE.Vector3(-hs, lightHeight, hs),
                new THREE.Vector3(-hs, lightHeight, hs + 2),
                
                new THREE.Vector3(hs, 0, hs),
                new THREE.Vector3(hs, lightHeight, hs),
                new THREE.Vector3(hs, lightHeight, hs),
                new THREE.Vector3(hs + 2, lightHeight, hs)
            ];
            var geom = new THREE.Geometry();
            points.forEach(function(p){geom.vertices.push(p)});
            var lines = new THREE.LineSegments(geom, material);
            lines.position.x = i;
            lines.position.z = j;
            lines.name = streetNumbers[(i + 150) / blocksize] + ' and ' +  streetNames[(j + 150) / blocksize];
            streets.push(lines);
        }
    }
    return streets;
}
