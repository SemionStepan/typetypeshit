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
labelRenderer.domElement.style.pointerEvents = 'none'; // Важно: чтобы текст не мешал кликать!(из гайда хз как работает)
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
// Создаем HTML-элемент для текста
const wordDiv = document.createElement('div');
const enemyWord = 'привет'; // Запоминаем слово
wordDiv.textContent = enemyWord; // Показываем его над врагом
wordDiv.style.color = 'white';
wordDiv.style.fontSize = '30px';
wordDiv.style.fontWeight = 'bold';
wordDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)'; // Тень для читаемости
const wordLabel = new CSS2DObject(wordDiv);
wordLabel.position.set(0, 1, 0); // Поднимаем текст на 1 единицу вверх (над кубом)
enemy.add(wordLabel);
// Создаем HTML-элемент для отображения того, что мы печатаем
const inputDisplay = document.createElement('div');
inputDisplay.style.position = 'absolute';
inputDisplay.style.bottom = '40px';
inputDisplay.style.left = '50%';
inputDisplay.style.transform = 'translateX(-50%)';
inputDisplay.style.color = '#00ff00'; // Зеленый, как база
inputDisplay.style.fontSize = '50px';
inputDisplay.style.fontFamily = 'monospace';
inputDisplay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
document.body.appendChild(inputDisplay);

function animate() {
  requestAnimationFrame(animate);
  labelRenderer.render(scene, camera);
// Если враг еще не дошел до базы (база на Z=5, остановим его на Z=2)
  // Двигаем, только если враг существует в сцене (enemy.parent не null)
if (enemy.parent && enemy.position.z < 2) {
  enemy.position.z += 0.02;
}

  renderer.render(scene, camera);
}

animate();
let currentInput = ''; // Здесь храним то, что напечатал игрок

// Слушаем нажатия клавиш на всей странице
window.addEventListener('keydown', (event) => {
  // Если нажата обычная буква (длина символа равна 1)
  if (event.key.length === 1) {
    currentInput += event.key; // Добавляем букву к нашему вводу
  } 
  // Если нажат Backspace (удаление)
  else if (event.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1); // Удаляем последнюю букву
  }

  // Показываем введенный текст на экране
  inputDisplay.textContent = currentInput;

  // ПРОВЕРКА: совпадает ли введенное слово с тем, что над врагом?
  if (currentInput === enemyWord) {
    console.log('БАХ! ВРАГ УНИЧТОЖЕН!');
    
    // Убираем врага из сцены
    scene.remove(enemy); 
    
    // Очищаем ввод
    currentInput = '';
    inputDisplay.textContent = '';
  }
});