import './style.scss'
import catImage from './img/blackcat.png'

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
  <h1>Color Invert</h1>
  <div>
    <img id="image" width="320" src="${catImage}" alt="image"/><br>
    <canvas id="canvas1" class="placeholder"></canvas>
    <canvas id="canvas2" class="placeholder"></canvas>
  </div>
`
const image = document.querySelector('#image');

const imgProc = () => {
  console.log('imgProc');

  const src = cv.imread(image);

  const dst1 = new cv.Mat();
  cv.cvtColor(src, dst1, cv.COLOR_RGBA2RGB);
  cv.bitwise_not(dst1, dst1);
  cv.imshow('canvas1', dst1);

  const dst2 = new cv.Mat();
  cv.cvtColor(src, dst2, cv.COLOR_RGBA2GRAY);
  cv.bitwise_not(dst2, dst2);
  cv.imshow('canvas2', dst2);

  [src, dst1, dst2].forEach(m => m.delete());
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