import './style.scss'
import lenaImaage from './img/lena.jpg'
import Haarcascade from './utils/haarcascade_frontalface_alt.xml'

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
  <h1>Face detect</h1>
  <div>
    <img id="image" width="320" src="${lenaImaage}" alt="image"/><br>
    <canvas id="canvas1" class="placeholder"></canvas>
    <canvas id="canvas2" class="placeholder"></canvas>
  </div>
`
const image = document.querySelector('#image');
const cascadeFile = Haarcascade;

const drawRectangles = (mat, faces) => {
  console.log('drawRectangles');

  for (let i=0; i<faces.size(); i++) {
    const face = faces.get(i);
    const point1 = new cv.Point(face.x, face.y);
    const point2 = new cv.Point(face.x+face.width, face.y+face.height);
    cv.rectangle(mat, point1, point2, new cv.Scalar(255, 255, 255), 3);
  }
}

const imgProc = () => {
  console.log('imgProc');
  
  const src = cv.imread(image);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
  
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  cv.equalizeHist(gray, gray);
  cv.imshow('canvas1', gray);

  const req = new XMLHttpRequest();
  req.responseType = 'arraybuffer';
  req.open('GET', cascadeFile, true);
  req.onload = (e) => {
    console.log(`XML request status: 
      ${req.status}, Type ${req.responseType}, State ${req.readyState}`);

    const path = 'boo';
    const data = new Uint8Array(req.response);
    console.log(`Cascade data size: ${data.length}`);
    cv.FS_createDataFile('/', path, data, true, false, false);

    const classifier = new cv.CascadeClassifier();
    classifier.load(path);

    const faces = new cv.RectVector();
    classifier.detectMultiScale(gray, faces);
    console.log('faces:', faces.size());

    drawRectangles(src, faces);
    cv.imshow('canvas2', src);

    [src, gray, faces, classifier].forEach((mat) => mat.delete());
  }
  req.send();
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