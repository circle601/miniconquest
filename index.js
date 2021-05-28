import * as THREE from 'three';
import * as ORBIT_CONTROLS from 'three-orbit-controls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const earthRadius = 5;
const earthGeometry = new THREE.IcosahedronGeometry(earthRadius, 5);
const earthMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x4cff00, wireframe: true });
const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthSphere);




// Setup the controls
const OrbitControls = ORBIT_CONTROLS(THREE);
const controls = new OrbitControls(camera, renderer.domElement);

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