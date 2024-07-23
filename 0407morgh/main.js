import './style.scss'
import powerlinesImage from './img/powerlines.jpg'

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
  <h1>Erase the wires</h1>
  <div>
    <select id="select" style="margin-bottom: 40px;">
      <option value="111111111" selected>All</option>
      <option value="010010010">Vertical Line</option>
      <option value="000111000">Horizontal Line</option>
    </select>
  </div>
  <div>
    <img id="image" width="320" src="${powerlinesImage}" alt="image"/><br>
     <canvas id="canvas" class="placeholder"></canvas>
  </div>
`
const image = document.querySelector('#image');
const select = document.querySelector('#select');

const imgProc = (e) => {
  console.log('imgProc');
  
  const src = cv.imread(image);

  const kernelArray = select.value.split('').map(i => Number(i));
  const kernel = cv.matFromArray(3, 3, cv.CV_8UC1, kernelArray);

  const morph = new cv.Mat();
  const anchor = new cv.Point(-1, -1);
  cv.morphologyEx(src, morph, cv.MORPH_CLOSE, kernel, anchor, 1);
  cv.imshow('canvas', morph);

  [src, kernel, morph].forEach((mat) => mat.delete());
};

const opencvReady = () => {
  console.log('opencvReady');
  select.addEventListener('change', imgProc);
  imgProc();
};

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    console.log('Module initialized');
    if (cv) {
      opencvReady();
    } else {
      console.error('cv is not defined');
    }
   }, 
};