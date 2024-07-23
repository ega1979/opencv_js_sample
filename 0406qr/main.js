import './style.scss'
import qrImage from './img/qr.png'
import sandImage from './img/sand.png'

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
  <h1>Detect QRCode</h1>
  <div>
    <img id="imageBg" width="320" src="${sandImage}" alt="image" style="display:none;" />
    <img id="imageQr" width="246" src="${qrImage}" alt="image" style="display:none;" /><br>
    <canvas id="canvas1" class="placeholder"></canvas><br>
    <canvas id="canvas2" class="placeholder"></canvas>
  </div>
  <div>
    <input type="button" id="button" value="Click" class="click" />
    <span id="span" width="100">Analyze Result</span>
  </div>
`
const imageBg = document.querySelector('#imageBg');
const imageQr = document.querySelector('#imageQr');
const canvas1 = document.querySelector('#canvas1');
const ctx = canvas1.getContext('2d');
const button = document.querySelector('#button');
const span = document.querySelector('#span');
let deg = 0;

const rotate = (deg) => {
  console.log('rotate: ', deg);

  const side = 350;
  canvas1.width = canvas1.height = side;
  ctx.drawImage(imageBg, 0, 0, canvas1.width, canvas1.height);
  ctx.translate(side/2, side/2);
  ctx.rotate(deg * Math.PI / 180);
  const w = imageQr.width;
  const h = imageQr.height;
  ctx.drawImage(imageQr, 0, 0, w, h, -w/2, -h/2, w, h);
}

const decodePoint = (points) => {
  console.log('decodePoint');

  let floatArr = [];
  
  for(let i=0; i<points.cols; i++) {
    floatArr.push([...points.floatPtr(0, i)]);
  }
  
  return floatArr;
}

const drawPoly = (img, points) => {
  console.log('drawPoly');

  cv.cvtColor(img, img, cv.COLOR_RGBA2RGB);
  const mv = new cv.MatVector();
  const mat = new cv.Mat();
  points.convertTo(mat, cv.CV_32SC2);
  mv.push_back(mat);
  cv.polylines(img, mv, true, new cv.Scalar(255, 0, 0), 5);
  cv.imshow('canvas2', img);
  [mv, mat].forEach((mat) => mat.delete());
}

const imgProc = (e) => {
  console.log('imgProc');
  
  const data = ctx.getImageData(0, 0, canvas1.width, canvas1.height);
  const src = cv.matFromImageData(data);
  
  const detector = new cv.QRCodeDetector();
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  
  const points = new cv.Mat();
  const ret = detector.detect(gray, points);
  console.log(`QRCode detected: ${ret}, rows: ${points.rows}, cols: ${points.cols}
    type: ${points.type()}`);
  
  const text = detector.decode(src, points);
  span.innerHTML = text;

  const floatArr = decodePoint(points);
  console.log('points:', floatArr);
  drawPoly(src, points);

  [src, points, detector].forEach((mat) => mat.delete());
};

const setup = () => {
  console.log('Setup');
  setInterval(() => {
    rotate(deg);
    deg = (deg + 1 % 360);
  },50);
};

window.addEventListener('load', setup);
// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    button.addEventListener('click', imgProc);
   }, 
};