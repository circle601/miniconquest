import * as THREE from 'three';
import * as ORBIT_CONTROLS from 'three-orbit-controls';
import _ from 'lodash';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xff0000, 1, 100);
light.position.set(50, 50, 50);
scene.add(light);

const earthRadius = 5;
const earthGeometry = new THREE.IcosahedronGeometry(earthRadius, 4);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x1E7E62, wireframe: false });
const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthSphere);

console.log(earthSphere);
// console.log(earthSphere.geometry.index);

const positionsRaw = earthSphere.geometry.getAttribute('position').array;
const verticies = _.chunk(positionsRaw, 3);
const triangles = _.chunk(verticies, 3);

// console.log(verticies);
// console.log(triangles);


triangles.map(triangle => {
	const facePointerGeometry = new THREE.BoxGeometry(.1, .1, .1);
	const facePointerMaterial = new THREE.MeshNormalMaterial({ color: 0xffffff, wireframe: false });
	const facePointerSphere = new THREE.Mesh(facePointerGeometry, facePointerMaterial);

	facePointerSphere.position.x = (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3;
	facePointerSphere.position.y = (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3;
	facePointerSphere.position.z = (triangle[0][2] + triangle[1][2] + triangle[2][2]) / 3;

	// Lock its rotation onto the planet's surface using vector comparison.
	facePointerSphere.lookAt(earthSphere.position);

	scene.add(facePointerSphere);
});


// Setup the controls
const OrbitControls = ORBIT_CONTROLS(THREE);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 6.25;
controls.maxDistance = 15;

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(9, 9, 9);
controls.update();

function animate() {
	requestAnimationFrame(animate);

    // Update and smooth camera.
	controls.update();

	renderer.render(scene, camera);
}
animate();