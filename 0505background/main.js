import './style.scss'
import blackcatImage from './img/capel.png';
import capelImage from './img/sand.jpg';

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
  <h1>Change Background</h1>
  <div>
    <img id="image1" width="320" src=${blackcatImage} alt="image"><br>
    <img id="image2" width="320" src=${capelImage} alt="image">
    <br>
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
  <div>
    <input type="range" id="range1" value="1" min="0" max="2" step="0.1">
    <span id="span1" class="currentValue">Con Multiple 1</span><br>
    <input type="range" id="range2" value="0" min="-127" max="127">
    <span id="span2" class="currentValue">Con Add 0</span>
  </div>
`;

const image1 = document.querySelector('#image1');
const image2 = document.querySelector('#image2');
const range1 = document.querySelector('#range1');
const range2 = document.querySelector('#range2');
const span1 = document.querySelector('#span1');
const span2 = document.querySelector('#span2');

const imgProc = (e) => {
  console.log('imgProc');

  const fg = cv.imread(image1);
  const bg = cv.imread(image2);
  const fgBinary = new cv.Mat();

  cv.cvtColor(fg, fgBinary, cv.COLOR_RGBA2GRAY);
  cv.threshold(fgBinary, fgBinary, 128, 255,
    cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

  const alpha = Number(range1.value);
  const beta = Number(range2.value);
  cv.convertScaleAbs(fg, fg, alpha, beta);
  span1.innerHTML = `Con Multiple ${alpha}`;
  span2.innerHTML = `Con Add ${beta}`;

  fg.copyTo(bg, fgBinary);
  cv.imshow('canvas', bg);

  [fg, bg, fgBinary].forEach(m => m.delete());};


// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    console.log('Module initialized');
    if (cv) {
      range1.addEventListener('input', imgProc);
      range2.addEventListener('input', imgProc);
      imgProc();
    } else {
      console.error('cv is not defined');
    }
  },
};