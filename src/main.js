import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#app').appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; 
document.querySelector('#app').appendChild(labelRenderer.domElement);

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
const floorMaterial = new THREE.MeshStandardMaterial(
{ 
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
const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 }); 
const playerBarrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
playerBarrel.position.set(0, 1, 4.25); 
scene.add(playerBarrel);

// враги туту спавнит
const spawnGeometry = new THREE.PlaneGeometry(8, 8);
const spawnMaterial = new THREE.MeshStandardMaterial(
{ 
  color: 0xff0000, 
  transparent: true, 
  opacity: 0.3 
});
const spawnPoint = new THREE.Mesh(spawnGeometry, spawnMaterial);
spawnPoint.rotation.x = -Math.PI / 2; 
spawnPoint.position.set(0, 0.01, -15); 
scene.add(spawnPoint);

// теперь у врагов пул(дед)
const POOL_SIZE = 10;
const enemies = []; 
const wordList = ['кот', 'дом', 'лес', 'сон', 'мир', 'лук', 'рак', 'сыр'];

const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

for (let i = 0; i < POOL_SIZE; i++) 
{
  const mesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
  
  const wordDiv = document.createElement('div');
  wordDiv.style.color = 'white';
  wordDiv.style.fontSize = '30px';
  wordDiv.style.fontWeight = 'bold';
  wordDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
  
  const wordLabel = new CSS2DObject(wordDiv);
  wordLabel.position.set(0, 1, 0);
  mesh.add(wordLabel);
  
  mesh.visible = false; 
  scene.add(mesh);
  
  enemies.push(
  {
    mesh: mesh,
    wordDiv: wordDiv,
    word: '',
    isActive: false
  });
}

// Функция спавна врага
function spawnEnemy() 
{
  const enemyData = enemies.find(e => !e.isActive);
  if (!enemyData) return; 

  const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
  enemyData.word = randomWord;
  enemyData.wordDiv.textContent = randomWord;
  
  enemyData.isActive = true;
  enemyData.mesh.visible = true;
  
  const randomX = (Math.random() - 0.5) * 6; 
  enemyData.mesh.position.set(randomX, 0.5, -15);
}

// Интерфейс для ввода
const inputDisplay = document.createElement('div');
inputDisplay.style.position = 'absolute';
inputDisplay.style.bottom = '40px';
inputDisplay.style.left = '50%';
inputDisplay.style.transform = 'translateX(-50%)';
inputDisplay.style.color = '#00ff00'; 
inputDisplay.style.fontSize = '50px';
inputDisplay.style.fontFamily = 'monospace';
inputDisplay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
document.body.appendChild(inputDisplay);

function animate() 
{ // анимация анимирует
  requestAnimationFrame(animate);
 
  enemies.forEach(enemyData => 
  {
    if (enemyData.isActive) 
    {
      if (enemyData.mesh.position.z < 2) 
      {
        enemyData.mesh.position.z += 0.02;
      }
    }
  });

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();

let currentInput = '';

window.addEventListener('keydown', (event) => 
{
  if (event.key.length === 1) 
  {
    currentInput += event.key; 
  } 
  else if (event.key === 'Backspace') 
  {
    currentInput = currentInput.slice(0, -1); 
  }

  inputDisplay.textContent = currentInput;

  // сколько активных
  enemies.forEach(enemyData => 
  {
    if (enemyData.isActive && currentInput === enemyData.word) 
    {
      console.log('БАХ! Уничтожено: ' + enemyData.word);
      
      // Прячем врага обратно в пул
      enemyData.isActive = false;
      enemyData.mesh.visible = false;
      
      currentInput = '';
      inputDisplay.textContent = '';
    }
  });
});

// Запускаем спавн каждые 2 секунды и сразу создаем первого
setInterval(spawnEnemy, 2000);
spawnEnemy();