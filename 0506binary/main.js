import './style.scss'
import capelImage from './img/capel.png';

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
  <h1>Black and White</h1>
  <div>
    <img id="image" width="320" src=${capelImage} alt="image">
    <br>
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
  <div>
    <label>Threshold</label><br>
    <input type="range" id="range" value="128" min="1" max="255">
    <span id="span" class="currentValue">128</span><br>
    <label>Otsu's method</label>
    <input type="checkbox" id="checkbox">
  </div>
`;

const image = document.querySelector('#image');
const range = document.querySelector('#range');
const span = document.querySelector('#span');
const checkbox = document.querySelector('#checkbox');

const imgProc = (e) => {
  console.log('imgProc');

  const src = cv.imread(image);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
  const dst = new cv.Mat();

  const value = Number(range.value);
  const max = Number(range.max);

  let flag = cv.THRESH_BINARY;
  if (checkbox.checked) {
    flag = cv.THRESH_BINARY | cv.THRESH_OTSU;
  }

  let thresh = cv.threshold(src, dst, value, max, flag);
  cv.imshow('canvas', dst);
  src.delete();
  dst.delete();

  span.innerHTML = thresh;
  return thresh;
};

const rangeHandle = () => {
  console.log('rangeHandle');
  imgProc();
}

const checkboxHandle = () => {
  console.log('checkboxHandle');
  const thresh = imgProc();
  range.value = thresh;
}

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    console.log('Module initialized');
    if (cv) {
      range.addEventListener('change', rangeHandle);
      checkbox.addEventListener('change', checkboxHandle);
      imgProc();
    } else {
      console.error('cv is not defined');
    }
  },
};