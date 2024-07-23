import './style.scss'
import bidenImage from './img/biden.png'

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
  <h1>Tilt correct</h1>
  <div>
    <img id="imageHid" src="${bidenImage}" class="hide" /><br>
    <img id="image" width="240" src="${bidenImage}" alt="image"/><br>
    <canvas id="canvas1" class="placeholder"></canvas>
    <canvas id="canvas2" class="placeholder"></canvas>
    <canvas id="canvas3" class="placeholder"></canvas>
  </div>
`
const image = document.querySelector('#image');
const imageHid = document.querySelector('#imageHid');

const showResized = (canvasId, src) => {
  console.log('showResized', canvasId);
  console.log('src', src);
  
  const scale = image.width / image.naturalWidth;
  const dst = new cv.Mat();
  cv.resize(src, dst, new cv.Size(), scale, scale);
  cv.imshow(canvasId, dst);
  dst.delete();
}

const prepare = (img, contour) => {
  console.log('prepare');

  cv.cvtColor(img, contour, cv.COLOR_RGBA2GRAY);
  cv.Canny(contour, contour, 50, 150);
  const kernel = cv.Mat.ones(7, 7, cv.CV_8UC1);
  cv.morphologyEx(contour, contour, cv.MORPH_CLOSE, kernel);
  
  kernel.delete();
}

const getLines = (img) => {
  console.log('getLines');

  const mat = new cv.Mat();
  cv.HoughLinesP(img, mat, 1, Math.PI/180, 50, 100, 0);
  
  let lines = [];
  for(let i=0; i<mat.rows; i++) {
    let ptr = [... mat.intPtr(i, 1)];
    lines.push(ptr);
  }
  
  console.log(`Hough mat fotmat: 
    Type=${mat.type()} Rows=${mat.rows} Cols=${mat.cols}`);
  mat.delete();
  return lines;
}

const screenLines = (lines) => {
  console.log('screenLines');

  const maxRadian = 20 * Math.PI / 180;
  const screened = lines.filter((arr) => {
    const theta = Math.atan((arr[3] - arr[1])) / (arr[2] - arr[0]);
    return Math.abs(theta) < maxRadian;
  });

  console.log(`After screening: ${screened.length} lines`);
  return screened;
}

const drawLines = (img, lines) => {
  console.log('drawLines');

  const color = new cv.Scalar(128, 128, 128);
  lines.forEach((lines) => {
    const p0 = new cv.Point(lines[0], lines[1]);
    const p1 = new cv.Point(lines[2], lines[3]);
    cv.line(img, p0, p1, color, 3);
  });
}

const avarageAngle = (lines) => {
  console.log('avarageAngle');

  const radianArr = lines.map((arr) => {
    return Math.atan((arr[3] - arr[1]) / (arr[2] - arr[0]));
  });
  const radian = radianArr.reduce((a, b) => a + b) / radianArr.length;
  const degree = radian * 180 / Math.PI;

  console.log(`Rotation: ${radian} (${degree})`);
  return [radian, degree];
}

const imgProc = () => {
  console.log('imgProc');
  
  const src = cv.imread(imageHid);
  cv.cvtColor(src,src, cv.COLOR_RGBA2RGB);

  const contour = new cv.Mat();
  prepare(src, contour);
  showResized('canvas1', contour);

  const lines = getLines(contour);
  const screened = screenLines(lines);
  const lineSrc = src.clone();
  drawLines(lineSrc, screened);
  showResized('canvas2', lineSrc);
  const [radian, degree] = avarageAngle(screened);

  const point = new cv.Point(src.cols/2, src.rows/2);
  const rotMat = cv.getRotationMatrix2D(point, degree, 1);
  cv.warpAffine(src, src, rotMat, new cv.Size(src.cols, src.rows));
  showResized('canvas3', src);

  [src, contour, lineSrc].forEach((mat) => mat.delete());
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