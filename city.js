var threediv = document.getElementById('threeapp');
var width = threediv.clientWidth - 1;
var height = threediv.clientHeight - 20;

var scene = new THREE.Scene();
var scale = 16;
var camera = new THREE.OrthographicCamera(width / -scale, width / scale, height / scale, height / -scale, 0, 1000);
camera.position.z = 50;
camera.position.y = 25;
camera.rotation.x -= 0.5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
threediv.appendChild(renderer.domElement);

var testgeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(10, 10, 10));
//var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
var material = new THREE.LineBasicMaterial({color: 0x00ff00});
//var cube = new THREE.Mesh(testgeom, material);
var cube = new THREE.LineSegments(testgeom, material);
scene.add(cube);

var points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 3),
    new THREE.Vector3(0, 2, 3),
    new THREE.Vector3(1, 0, 3),
    new THREE.Vector3(1, 2, 3),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(2, 0, 0),
    new THREE.Vector3(2, 0, 2),
    new THREE.Vector3(2, 2, 2),
    new THREE.Vector3(2, 2, 0)
];
var convexgeom = new THREE.ConvexGeometry(points);
var shape = new THREE.LineSegments(new THREE.EdgesGeometry(convexgeom), new THREE.MeshBasicMaterial());
scene.add(shape);

var axis = new THREE.AxisHelper(5);
scene.add(axis);

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.02;
    axis.rotation.y += 0.02;
    shape.rotation.y += 0.02;
    renderer.render(scene, camera);
}
animate();
