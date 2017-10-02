var origin = new THREE.Vector3();
var currentsector = null;
var currentbuilding = null;

function createWorld(divName) {
    var threediv = document.getElementById(divName);
    var width = threediv.clientWidth - 1;
    var height = threediv.clientHeight - 20;

    var scene = new THREE.Scene();
    var scale = 3;
    var camera = new THREE.OrthographicCamera(width / -scale, width / scale, height / scale, height / -scale, 0, 4000);
    isoView(camera);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    threediv.appendChild(renderer.domElement);
    return {scene, camera, renderer};
}

function isoView(camera) {
    camera.rotation.x = -0.5;
    // Move viewing volume back
    camera.position.z = 200;
    camera.position.y = 130;
    camera.updateProjectionMatrix();
}

function topView(camera) {
    camera.rotation.x = Math.PI / 2;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.updateProjectionMatrix();
}


var material = new THREE.LineBasicMaterial({color: 0x00ff00});

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
    return obj;
}

function generateBuildings() {
    var buildings = [];
    for (var i = -150; i < 150; i += 22) {
        for (var j = -150; j < 150; j += 22) {
            if (Math.abs(i + j) > 200 ||
               (Math.abs(i - j) > 200))
                continue; // Make it circular

            if (Math.random() * 50 < 4) // Leave some gaps
                continue;

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

function clearScene(scene) {
    while(scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

function changeSector(sector) {
    if (sector == null)
        return;
    clearScene(cityWorld.scene);
    var buildings = sector.bldg;
    buildings.forEach(function(b){b.rotation.y = 0;});
    buildings.forEach(function(b){cityWorld.scene.add(b)});
    currentsector = sector;
    if (!cityWorld.animating) {
        cityWorld.animating = true;
        animate(cityWorld, true);
    }
}

function changeBuilding(building) {
    clearScene(buildingWorld.scene);
    currentbuilding = building;
    if (building == null)
        return;
    building.position.x = 0;
    building.position.y = 0;
    building.position.z = 0;
    building.rotation.y = 0;
    buildingWorld.scene.add(building);
    if (!buildingWorld.animating) {
        buildingWorld.animating = true;
        animate(buildingWorld);
    }
}

//var axis = new THREE.AxisHelper(15);
//scene.add(axis);

function animate(world, cityMode) {
    if (cityMode) {
        if (currentsector != null) {
            requestAnimationFrame(function(){animate(world, cityMode)});
            if (world.camera.rotation.x != Math.PI / 2) // Only spin buildings in iso view
                world.scene.rotation.y += 0.01
            else
                world.scene.rotation.y = 0;
        }
    }
    else {
        if (currentbuilding != null) {
            requestAnimationFrame(function(){animate(world, cityMode)});
            if (world.camera.rotation.x != Math.PI / 2) // Only spin buildings in iso view
                currentbuilding.rotation.y += 0.01;
            else
                currentbuilding.rotation.y = 0;
        }
    }
    world.renderer.render(world.scene, world.camera);
}
