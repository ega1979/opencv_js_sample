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
  <h1>Color Posterize</h1>
  <div>
    <img id="image" width="320" src=${capelImage} alt="image">
    <br>
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
  <div>
    <label>Effective Num of Bits</label><br>
    <input type="range" id="range" value="8" min="1" max="8">
    <span id="span" class="currentValue">8</span><br>
    <label>HSV</label>
    <input type="checkbox" id="checkbox">
  </div>
`;

const image = document.querySelector('#image');
const range = document.querySelector('#range');
const span = document.querySelector('#span');
const checkbox = document.querySelector('#checkbox');

const imgProc = () => {
  console.log('imgProc');

  const src = cv.imread(image);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);

  if(checkbox.checked){ cv.cvtColor(src, src, cv.COLOR_RGB2HSV); }

  const nBits = Number(range.value);
  const mask = 0xFF << (8 - nBits) & 0xFF;
  console.log(`# of bits: ${nBits}, mask: ${mask.toString(2)}`);

  const dst = new cv.Mat(src.rows, src.cols, src.type());

  for(let pos=0; pos<dst.data.length; pos++){
    const value = src.data[pos];
    dst.data[pos] = value & mask;
  }

  if(checkbox.checked){
    cv.cvtColor(dst, dst, cv.COLOR_HSV2RGB);
    cv.imshow('canvas', dst);

    [src, dst].forEach(m => m.delete());
  }
};

const rangeHandle = () => {
  console.log('rangeHandle');
  span.innerHTML = range.value;
  imgProc();
}

const checkboxHandle = () => {
  console.log('checkboxHandle');
  imgProc();
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