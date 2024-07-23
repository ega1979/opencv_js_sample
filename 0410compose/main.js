import './style.scss'
import catImage from './img/blackcat.png'
import sandImage from './img/sand.jpg'
import Overlay from './js/overlay.js';

// ダイナミックインポートを使用してopencv.jsを非同期に読み込む
(async () => {
  try {
    const opencv = await import('./js/opencv.js');
    console.log('import success', opencv);
  } catch (error) {
    console.error('Error loading opencv.js:', error);
  }
})();

document.querySelector('#app').innerHTML = `
  <h1>Image compose</h1>
  <div>
    <img id="image1" width="320" src="${catImage}" alt="image"/><br>
    <img id="image2" width="320" src="${sandImage}" alt="image"/><br>
  </div>
  <div>
    <div id="divAdd" class="inline"><canvas id="canvasAdd" class="placeholder"></canvas></div><br>
    <div id="divSub" class="inline"><canvas id="canvasSub" class="placeholder"></canvas></div><br>
    <div id="divMul" class="inline"><canvas id="canvasMul" class="placeholder"></canvas></div><br>
    <div id="divDiv" class="inline"><canvas id="canvasDiv" class="placeholder"></canvas></div><br>
    <div id="divWei" class="inline"><canvas id="canvasWei" class="placeholder"></canvas></div>
  </div>
`
const image1 = document.querySelector('#image1');
const image2 = document.querySelector('#image2');

const imgProc = () => {
  console.log('imgProc');
  
  const img1 = cv.imread(image1);
  cv.cvtColor(img1, img1, cv.COLOR_RGBA2RGB);
  const img2 = cv.imread(image2);
  cv.cvtColor(img2, img2, cv.COLOR_RGBA2RGB);
  cv.resize(img2, img2, img1.size());

  const result = new cv.Mat();
  cv.add(img1, img2, result);
  cv.imshow('canvasAdd', result);
  new Overlay('divAdd', 'cv.add', 0, 0, 16, 'black');

  cv.subtract(img2, img1, result);
  result.convertTo(result, -1, 1.2, 20);
  cv.imshow('canvasSub', result);
  new Overlay('divSub', 'cv.subtract', 0, 0, 16, 'white');

  cv.multiply(img1, img2, result, 1/255);
  cv.imshow('canvasMul', result);
  new Overlay('divMul', 'cv.multiply', 0, 0, 16, 'white');

  cv.divide(img1, img2, result, 100);
  cv.imshow('canvasDiv', result);
  new Overlay('divDiv', 'cv.divide', 0, 0, 16, 'black');

  cv.addWeighted(img1, 0.5, img2, 0.5, 0, result);
  cv.imshow('canvasWei', result);
  new Overlay('divWei', 'cv.addWeighted', 0, 0, 16, 'black');

  [img1, img2, result].forEach(m => m.delete());
};

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    console.log('Module initialized');
    if (cv) {
      imgProc();
    } else {
      console.error('cv is not defined');
    }
   }, 
};