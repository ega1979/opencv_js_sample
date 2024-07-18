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
  <h1>Draw a circle with floating point numbers</h1>
  <div id="container">
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
`

const canvas = document.querySelector('#canvas');

const drawCircle = (mat, pix, cx, cy, r) => {
  const f = new Float32Array([pix]),
  fBuffer = new Uint8Array(f.buffer);
  console.log(`${f} = ${fBuffer}`);

  for(let i = 0; i < 360; i += 0.5) // i = degree
  {
    let radian = i * Math.PI / 180,
    x = Math.floor(cx + r * Math.cos(radian)),
    y = Math.floor(cy + r * Math.sin(radian)),
    pos = (x + y * mat.cols) * 4;
    for(let j = 0; j < 4; j++)
    {
      mat.data[pos + j] = fBuffer[j];
    }
  }
};

const imgProc = () => {
  const width = 320,
  height = 240,
  mat = new cv.Mat(height, width, cv.CV_32FC1, new cv.Scalar(0.5));
  mat.setTo(new cv.Scalar(0.7));
  drawCircle(mat, 0.8, width / 2, height / 2, height * 0.4);
  cv.imshow('canvas', mat);
  mat.delete();
};

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
