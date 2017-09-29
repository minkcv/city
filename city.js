var threediv = document.getElementById('threeapp');
var width = threediv.clientWidth - 1;
var height = threediv.clientHeight - 1;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
threediv.appendChild(renderer.domElement);

var testgeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
//var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
var material = new THREE.LineBasicMaterial({color: 0x00ff00});
//var cube = new THREE.Mesh(testgeom, material);
var cube = new THREE.LineSegments(testgeom, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.05;
    cube.rotation.y += 0.05;
    renderer.render(scene, camera);
}
animate();
