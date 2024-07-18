import './style.scss'
import Overlay from './js/overlay.js';
import ntc from './js/ntc.js';
// ダイナミックインポートを使用してopencv.jsを非同期に読み込む
(async () => {
  try {
    await import('./js/opencv.js');
  } catch (error) {
    console.error('Error loading opencv.js:', error);
  }
})();

document.querySelector('#app').innerHTML = `
  <h1>Pick pixel color</h1>
  <p>It will display pixel color when you click left mouse.
  <kbd>Alt</kbd> + It will release Mat with left mouse.
  </p>
  <div id="container">
    <img id="image" width="320" src="./img/mashroom.png" alt="mashroom">
    元: <canvas id="canvas" class="placeholder"></canvas>
    色名: <canvas id="canvas2" class="placeholder"></canvas>
  </div>
  `

const image = document.querySelector('#image');
const canvas = document.querySelector('#canvas');
canvas.width = canvas.height = 100;
const ctx = canvas.getContext('2d');
const canvas2 = document.querySelector('#canvas2');
canvas2.width = canvas2.height = 100;
const ctx2 = canvas2.getContext('2d');

let mat, layer;

const getPixel = (e) => {
  if(!mat || !layer) return;

  if(e.altKey === true) {
    mat.delete();
    mat = null;
    console.log('Mat released');
    return;
  }

  const c = e.offsetX;
  const r = e.offsetY;
  const pixel = [... mat.ucharPtr(r, c)].slice(0, -1);
  const hexValue = '#' + pixel.map(p => p.toString(16).padStart(2, 0)).join('');
  const match = ntc.name(hexValue); // comapre hexvalue to ntc color using ntc.js
  const matchName = match[1];
  const matchHex = match[0];
  console.log(`${pixel} ${matchName} ... (${hexValue} => ${matchHex})`);
  layer.changeText(`(${c}, ${r}) ${matchName}`, -1, c, r);

  ctx.fillStyle = `rgb(${pixel.join(',')})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx2.fillStyle = hexValue
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
};

const resourceReady = () => {
  layer = new Overlay('container', 'Select', 40, 40, 12);
  image.addEventListener('mousedown', getPixel);
}

const opencvReady = () => {
  mat = cv.imread(image);
}

window.addEventListener('load', resourceReady);

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    if (window.cv) {
      opencvReady();
    } else {
      console.error('cv is not defined');
    }
  }
};