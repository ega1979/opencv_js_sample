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
  <h1>Sepia Color</h1>
  <div>
    <img id="image" width="320" src="${catImage}" alt="image"/><br>
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
`
const image = document.querySelector('#image');

const filters = {
  sepia: [0.393, 0.769, 0.189, 0.349, 0.686, 0.168, 0.272, 0.534, 0.131],
  monochrome: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
  bgr: [0,0,1,0,1,0,1,0,0],
  allGreen: [0,0,0,0.299,0.587,0.114,0,0,0],
  reduction: [1.0,0,0,0,0,5,0,0,0,0.8]
}

const imgProc = () => {
  console.log('imgProc');

  const filter = filters.sepia;
  const matrix = cv.matFromArray(3, 3, cv.CV_32FC1, filter);

  const src = cv.imread(image);
  const dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
  cv.transform(src, dst, matrix);
  cv.imshow('canvas', dst);

  [src, dst, matrix].forEach((m) => m.delete());
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