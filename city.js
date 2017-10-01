var threediv = document.getElementById('threeapp');
var width = threediv.clientWidth - 1;
var height = threediv.clientHeight - 20;

var scene = new THREE.Scene();
var scale = 3;
var camera = new THREE.OrthographicCamera(width / -scale, width / scale, height / scale, height / -scale, 0, 4000);
//camera.rotation.x -= Math.PI / 2
camera.rotation.x = -0.5;
// zoom out
camera.position.z = 200;
camera.position.y = 130;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
threediv.appendChild(renderer.domElement);

var material = new THREE.LineBasicMaterial({color: 0x00ff00});

// shorthand for adding vectors
function addv(v1, v2) {
    return new THREE.Vector3().addVectors(v1, v2);
}

// x, z, width, depth, height
function generateBuilding(x, z, wi, de, he) {
    var h = new THREE.Vector3(0, he, 0);
    var p1 = new THREE.Vector3(x, 0, z);
    var p2 = new THREE.Vector3(x, 0, z + de);
    var p3 = new THREE.Vector3(x + wi, 0, z);
    var p4 = new THREE.Vector3(x + wi, 0, z + de);
    var points = [
        p1, p2, p3, p4,
        addv(p1, h), addv(p2, h), addv(p3, h), addv(p4, h)
    ];
    var convexgeom = new THREE.ConvexGeometry(points);
    return new THREE.LineSegments(new THREE.EdgesGeometry(convexgeom), material);
}

var buildings = [];
for (var i = -100; i < 100; i += 22) {
    for (var j = -100; j < 100; j += 22) {
        var r = Math.random() * 8 + 10;
        var h = Math.random() * 30 + 10;
        var x = Math.random() * 5 + i;
        var z = Math.random() * 5 + j;
        buildings.push(generateBuilding(x, z, r, r, h));
    }
}

buildings.forEach(function(e){scene.add(e)});

var axis = new THREE.AxisHelper(15);
scene.add(axis);

function animate() {
    requestAnimationFrame(animate);
    axis.rotation.y += 0.02;
    buildings.forEach(function(e){e.rotation.y += 0.01});
    renderer.render(scene, camera);
}
animate();
