import './style.scss'
import capelImage from './img/capel.png'

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
  <h1>Edge Image</h1>
  <div>
    <img id="image" width="320" src="${capelImage}" alt="image" />
    <canvas id="canvas1" class="placeholder"></canvas>
    <canvas id="canvas2" class="placeholder"></canvas>
    <canvas id="canvas3" class="placeholder"></canvas>
  </div>
`

const image = document.querySelector('#image')


const imgProc = (e) => {
  console.log('imgProc');
  
  const src = cv.imread(image);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);

  const edge = new cv.Mat();
  cv.Sobel(src, edge, cv.CV_8U, 1, 1, 5);
  cv.imshow('canvas1', edge);

  cv.Laplacian(src, edge, cv.CV_8U, 3);
  cv.imshow('canvas2', edge);

  cv.Canny(src, edge, 50, 150);
  cv.imshow('canvas3', edge);

  [src, edge].forEach((mat) => mat.delete());
};

const opencvReady = () => {
  console.log('OpenCV.js is ready');
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