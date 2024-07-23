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
  <h1>Edge Image Anime</h1>
  <div>
    <img id="image" width="320" src="${capelImage}" alt="image" />
    <canvas id="canvas1" class="placeholder"></canvas>
    <canvas id="canvas2" class="placeholder"></canvas>
  </div>
`
const image = document.querySelector('#image')

const imgProc = (e) => {
  console.log('imgProc');
  
  const src = cv.imread(image);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);

  const edge = new cv.Mat();
  cv.cvtColor(src, edge, cv.COLOR_RGB2GRAY);
  cv.Canny(edge, edge, 50, 150);
  cv.bitwise_not(edge, edge);
  cv.imshow('canvas1', edge);

  const color = new cv.Scalar(50, 50, 50);
  const bg = new cv.Mat(image.height, image.width, cv.CV_8UC3, color);

  const fg = new cv.Mat();
  cv.bilateralFilter(src, fg, 7, 75, 75, cv.BORDER_DEFAULT);

  fg.copyTo(bg, edge);
  cv.imshow('canvas2', edge);

  [src, edge, bg, fg].forEach((mat) => mat.delete());
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