import './style.scss'
import catImage from './img/blackcat.png'
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
  <h1>Monochrome color</h1>
  <div>
    <img id="image" width="320" src="${catImage}" alt="image"/><br>
    <canvas id="canvas1" class="placeholder"></canvas>
    <canvas id="canvas2" class="placeholder"></canvas>
  </div>
`
const image = document.querySelector('#image');

const imageLoaded = (e) => {
 console.log('imageLoaded');

 const canvas2 = document.querySelector('#canvas2');
 canvas2.width = image.width;
 canvas2.height = image.height;
 canvas2.style.filter = 'grayscale(1.0)';
 const ctx = canvas2.getContext('2d');
 ctx.drawImage(image, 0, 0, image.width, image.height);
};

const imgProc = () => {
  console.log('imgProc');

  const src  = cv.imread(image);
  const dst = new cv.Mat();
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.imshow('canvas1', dst);
  src.delete();
  dst.delete();
};

window.addEventListener('load', imageLoaded)
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