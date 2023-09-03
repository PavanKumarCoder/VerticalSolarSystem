import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const sun = createSun();
scene.add( sun );

const earth = createEarth();
scene.add( earth );

const sunCenter = new THREE.Vector3(0, 0, 0); // Center of the circle
const earthOrbitRadius = 5; // Radius of the circle

var speedFactor = 100000;

var earthRevolutionSpeed = 0.1;//(2 * Math.PI / (365 * 24 * 60 *60)) * speedFactor; // Speed of movement in radians per second
var moonRevolutionSpeed = 0.1;//(2 * Math.PI / (27 * 24 * 60 *60)) * speedFactor;// Speed of movement in radians per second

var earthRotationSpeed = (2 * Math.PI / (24 * 60 *60)) * speedFactor; // Speed of movement in radians per second
var moonRotationSpeed = (2 * Math.PI / (27 * 24 * 60 *60)) * speedFactor;// Speed of movement in radians per second

var earthSpeedRange = document.getElementById("earthSpeedRange");
earthSpeedRange.oninput = function() {
	earthRevolutionSpeed = this.value;
}

var moonSpeedRange = document.getElementById("moonSpeedRange");
moonSpeedRange.oninput = function() {
	moonRevolutionSpeed = this.value;
}

document.getElementById("btnResetSpeeds").onclick =
	function(){
		document.getElementById("earthSpeedRange").value  = 0.1;
		document.getElementById("moonSpeedRange").value  = 0.1;
		earthRevolutionSpeed = 0.1;
		moonRevolutionSpeed = 0.1;
	}

const moonOrbitRadius = 1; // Radius of the circle

const moon = createMoon();
scene.add( moon );

camera.position.z = 10;

document.addEventListener( 'wheel', onMouseWheel, false );

function onMouseWheel( event ) {
	camera.position.z += event.deltaY * 0.01; // move camera along z-axis
}

var ddChangeView = document.getElementById("ddChangeView");
ddChangeView.onchange = function() {
	view = this.value;

	if(view == "frontView"){
 		camera.position.copy(new THREE.Vector3(0,0,10));
 		camera.rotation.set(0,0,0);
		camera.lookAt(new THREE.Vector3(0,0,0));
	} else if(view == "sideView"){
		camera.position.copy(new THREE.Vector3(-10,0,0));
		camera.rotation.set(0,0,0);
		camera.lookAt(new THREE.Vector3(0,0,0));
	}
}

function animate() {
	requestAnimationFrame( animate );

	const time = performance.now() * 0.001; // Get the current time in seconds
  
    moveMeshInCircle(earth, sunCenter, new THREE.Vector3(0,0,0), earthOrbitRadius, earthRevolutionSpeed, time);
    moveMeshInCircle(moon, sunCenter, earth.position, moonOrbitRadius, moonRevolutionSpeed, time);
	rotateMesh(earth, earthRotationSpeed, time);
	rotateMesh(moon, moonRotationSpeed, time);

	if(view == "earthView"){
		camera.position.copy(earth.position);
		camera.rotation.copy(earth.rotation);
	}else if(view == "earthInCenterView"){
		//camera.position.copy(new THREE.Vector3(-10,0,0));
		//camera.rotation.set(0,0,0);
		//camera.lookAt(new THREE.Vector3(0,0,0));

		//var earthPosition = earth.position;
		//earthPosition.setX(-10);
		camera.position.copy(earth.position);
		camera.position.setX(-10);
		camera.lookAt(earth.position);
		//camera.rotation.set(0,0,0);
		//camera.rotation.copy(earth.rotation);
	}

	renderer.render( scene, camera );
}

animate();

function createSun(){

	const radius = 1; // Set the sphere's radius
	const widthSegments = 32; // Set the number of horizontal segments
	const heightSegments = 32; // Set the number of vertical segments
	const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	const sun = new THREE.Mesh( geometry, material );

	return sun;
}

function createEarth(){


	const radius = 0.5; // Set the sphere's radius
	const widthSegments = 32; // Set the number of horizontal segments
	const heightSegments = 32; // Set the number of vertical segments
	const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );

	const textureLoader = new THREE.TextureLoader();
    const imageUrl = 'images/earth.jpg'; // Replace with the path to your image
	textureLoader.load(imageUrl, (texture) => {
		material.map = texture; // Apply the loaded texture to the material
		material.needsUpdate = true; // Update the material to reflect the changes
	});

	const earth = new THREE.Mesh( geometry, material );

	return earth;
}

function createMoon(){

	const radius = 0.2; // Set the sphere's radius
	const widthSegments = 32; // Set the number of horizontal segments
	const heightSegments = 32; // Set the number of vertical segments
	const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

	const textureLoader = new THREE.TextureLoader();
    const imageUrl = 'images/moon.jpg'; // Replace with the path to your image
	textureLoader.load(imageUrl, (texture) => {
		material.map = texture; // Apply the loaded texture to the material
		material.needsUpdate = true; // Update the material to reflect the changes
	});

	const moon = new THREE.Mesh( geometry, material );

	return moon;
}

function moveMeshInCircle(mesh, center, transitionCenter, radius, speed, time) {
	const angle = (speed * time) % (Math.PI * 2); // Calculate the current angle based on time and speed
	const y = center.x + radius * Math.cos(angle); // Calculate the x position of the mesh
	const z = center.z + radius * Math.sin(angle); // Calculate the z position of the mesh
  
	mesh.position.set(center.x, y + transitionCenter.y, -z + transitionCenter.z); // Update the mesh's position
}

function rotateMesh(mesh, speed, time) {
	mesh.rotation.x -= 0.01;
}