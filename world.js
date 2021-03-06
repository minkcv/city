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

function isoView(camera, buildingMode) {
    camera.rotation.x = -0.5;
    // Move viewing volume back
    camera.position.z = 200;
    camera.position.y = 130;
    if (buildingMode)
        camera.position.y = 140;
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
    currentsector = sector;
    if (!cityWorld.animating) {
        cityWorld.animating = true;
        animate(cityWorld, true);
    }
    for (var i = 0; i < currentsector.tran.length; i++) {
        setTimeout(function(i) {
            return function() {
                cityWorld.scene.add(currentsector.tran[i]);
            }
        }(i), i * 50);
    }
    for (var i = 0; i < currentsector.bldg.length; i++) {
        setTimeout(function(i) {
            return function() {
                if (currentsector.bldg[i] != null)
                    cityWorld.scene.add(currentsector.bldg[i]);
            }
        }(i), i * 25);
    }
}

function changeBuilding(building) {
    clearScene(buildingWorld.scene);
    currentbuilding = building;
    if (building == null) {
        buildingWorld.animating = false;
        return;
    }
    building.position.x = 0;
    building.position.y = 0;
    building.position.z = 0;
    building.rotation.y = 0;
    building.elec.position.x = 0;
    building.elec.position.y = 0;
    building.elec.position.z = 0;
    building.elec.rotation.y = 0;
    building.plmb.position.x = 0;
    building.plmb.position.y = 0;
    building.plmb.position.z = 0;
    building.plmb.rotation.y = 0;
    buildingWorld.camera.zoom = 2;
    buildingWorld.camera.position.y = 140;
    buildingWorld.camera.updateProjectionMatrix();
    buildingWorld.scene.add(building);
    buildingWorld.scene.add(building.elec);
    buildingWorld.scene.add(building.plmb);
    buildingWorld.scene.rotation.y = cityWorld.scene.rotation.y; // keep rotations in sync
    if (!buildingWorld.animating) {
        buildingWorld.animating = true;
        animate(buildingWorld, false);
    }
}

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
                currentbuilding.elec.rotation.y += 0.01;
                currentbuilding.plmb.rotation.y += 0.01;
            }
            else {
                currentbuilding.rotation.y = 0;
                currentbuilding.elec.rotation.y = 0;
                currentbuilding.plmb.rotation.y = 0;
            }
        }
    }
    world.renderer.render(world.scene, world.camera);
}
