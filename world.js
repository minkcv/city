var origin = new THREE.Vector3();
var currentsector = null;
var currentbuilding = null;
var currentstreet = null;
var currentelectrical = null;

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
    buildings.forEach(function(b){ if (b != null) b.rotation.y = 0;});
    buildings.forEach(function(b){
        if (b != null) {
            cityWorld.scene.add(b)
            //cityWorld.scene.add(b.elec);
        }
    });
    var streets = sector.tran;
    streets.forEach(function(s){cityWorld.scene.add(s)});
    currentsector = sector;
    if (!cityWorld.animating) {
        cityWorld.animating = true;
        animate(cityWorld, true);
    }
}

function changeBuilding(building, road, elec) {
    clearScene(buildingWorld.scene);
    currentbuilding = building;
    currentstreet = road;
    currentelectrical = elec;
    if (building == null) {
        buildingWorld.animating = false;
        return;
    }
    building.position.x = 0;
    building.position.y = 0;
    building.position.z = 0;
    building.rotation.y = 0;
    road.position.x = 0;
    road.position.y = 0;
    road.position.z = 0;
    road.rotation.y = 0;
    elec.position.x = 0;
    elec.position.y = 0;
    elec.position.z = 0;
    elec.rotation.y = 0;
    buildingWorld.camera.zoom = 2;
    buildingWorld.camera.updateProjectionMatrix();
    buildingWorld.scene.add(building);
    buildingWorld.scene.add(road);
    buildingWorld.scene.add(elec);
    if (!buildingWorld.animating) {
        buildingWorld.animating = true;
        animate(buildingWorld, false);
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
            if (world.camera.rotation.x != Math.PI / 2) { // Only spin buildings in iso view
                currentbuilding.rotation.y += 0.01;
                currentstreet.rotation.y += 0.01;
                currentelectrical.rotation.y += 0.01;
            }
            else {
                currentbuilding.rotation.y = 0;
                currentstreet.rotation.y = 0;
                currentelectrical.rotation.y = 0;
            }
        }
    }
    world.renderer.render(world.scene, world.camera);
}
