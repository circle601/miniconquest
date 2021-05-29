import * as THREE from 'three';
import * as ORBIT_CONTROLS from 'three-orbit-controls';
import _ from 'lodash';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
light1.position.set(1, 1, 1);
scene.add(light1);



const earthRadius = 5;
const earthGeometry = new THREE.IcosahedronGeometry(earthRadius, 4);
const earthMaterial = new THREE.MeshLambertMaterial({
	vertexColors: true,
});




// console.log(earthSphere.geometry.index);

const positionsRaw = earthGeometry.getAttribute('position').array;
const verticies = _.chunk(positionsRaw, 3);
const triangles = _.chunk(verticies, 3);

// console.log(verticies);
// console.log(triangles);





var color = new THREE.Color();


const vertices = [];
const colors = [];


var index;
triangles.map(triangle => {
	vertices.push(triangle[0][0], triangle[0][1], triangle[0][2]);
	vertices.push(triangle[1][0], triangle[1][1], triangle[1][2]);
	vertices.push(triangle[2][0], triangle[2][1], triangle[2][2]);
	//geometry.faces.push(new THREE.Face3(index++, index++, index++));

	color.setRGB(Math.abs(triangle[2][1]) / earthRadius, 0.5, 0.5);
	colors.push(color.r, color.g, color.b);
	colors.push(color.r, color.g, color.b);
	colors.push(color.r, color.g, color.b);

	const facePointerGeometry = new THREE.BoxGeometry(.1, .1, .1);
	const facePointerMaterial = new THREE.MeshLambertMaterial();
	const facePointerSphere = new THREE.Mesh(facePointerGeometry, facePointerMaterial);

	facePointerSphere.position.x = (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3;
	facePointerSphere.position.y = (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3;
	facePointerSphere.position.z = (triangle[0][2] + triangle[1][2] + triangle[2][2]) / 3;

	// Lock its rotation onto the planet's surface using vector comparison.
	facePointerSphere.lookAt(0,0,0);

	scene.add(facePointerSphere);
});



//Make a face seperated geomtry
var geometry = new THREE.BufferGeometry();
geometry.setAttribute(
	'position',
	new THREE.BufferAttribute(new Float32Array(vertices), 3));



geometry.setAttribute(
	'color',
	new THREE.BufferAttribute(new Float32Array(colors), 3));

// compute Normals
geometry.computeVertexNormals();

// normalize the geometry
const earthSphere = new THREE.Mesh(geometry, earthMaterial);

scene.add(earthSphere);

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