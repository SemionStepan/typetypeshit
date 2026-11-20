import * as THREE from 'three';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#app').appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 8);
camera.lookAt(0, 1, -10);     

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x222222, 
  side: THREE.DoubleSide 
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; 
floor.position.y = -1; 
scene.add(floor);

const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
gridHelper.position.y = -0.99; 
scene.add(gridHelper);

// эээ ну это базированная база
const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); 
const playerBase = new THREE.Mesh(baseGeometry, baseMaterial);
playerBase.position.set(0, 0.5, 5); 
scene.add(playerBase);

// Ствол (другой ствол, оружие)
const barrelGeometry = new THREE.BoxGeometry(0.2, 0.2, 1.5);
const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Серый
const playerBarrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
playerBarrel.position.set(0, 1, 4.25); 
scene.add(playerBarrel);

// враги туту спавнит
const spawnGeometry = new THREE.PlaneGeometry(8, 8);
const spawnMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xff0000, 
  transparent: true, 
  opacity: 0.3 // Полупрозрачный красный
});
const spawnPoint = new THREE.Mesh(spawnGeometry, spawnMaterial);
spawnPoint.rotation.x = -Math.PI / 2; 
spawnPoint.position.set(0, 0.01, -15); 
scene.add(spawnPoint);

// враг
const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Красный
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(0, 0.5, -15); // Ставим ровно в точку спавна
scene.add(enemy);

function animate() {
  requestAnimationFrame(animate);

  // враг двигается (увеличиваем Z, так как игрок на Z=5)
  enemy.position.z += 0.02; 

  renderer.render(scene, camera);
}

animate();