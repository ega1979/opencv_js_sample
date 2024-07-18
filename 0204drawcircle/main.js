import './style.scss'
// ダイナミックインポートを使用してopencv.jsを非同期に読み込む
(async () => {
  try {
    await import('./js/opencv.js');
  } catch (error) {
    console.error('Error loading opencv.js:', error);
  }
})();

document.querySelector('#app').innerHTML = `
  <h1>Draw a circle in monochrome</h1>
  <div id="container">
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
`

const canvas = document.querySelector('#canvas');

const drawCircle = (mat, center_x, center_y, radius) => {

  for(let i = 0; i < 360; i += 0.5) // i = degree
  {
    let radian = i * Math.PI / 180,
    x = Math.floor(center_x + radius * Math.cos(radian)),
    y = Math.floor(center_y + radius * Math.sin(radian)),
    pos = x + y * mat.cols;
    mat.data[pos] = 255;
  }
};

const imgProc = () => {
  const size = new cv.Size(320, 240),
  mat = new cv.Mat(size, cv.CV_8UC1);
  console.log('size:', size);

  const center_x = Math.floor(size.width / 2),
  center_y = Math.floor(size.height / 2),
  radius = Math.floor(Math.min(center_x, center_y) * 0.8);

  drawCircle(mat, center_x, center_y, radius);
  cv.imshow('canvas', mat);
  mat.delete();
}

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    if (window.cv) {
      imgProc();
    } else {
      console.error('cv is not defined');
    }
  }
};