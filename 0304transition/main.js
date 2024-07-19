import './style.scss'
import matsumotoVideo from './img/matsumoto.mp4'
import capelVideo from './img/capel.mp4'
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
  <h1>Video Transitions</h1>
  <div>
    <video id="video1" src="${matsumotoVideo}" width="320" muted autoplay loop></video>
    <video id="video2" src="${capelVideo}" width="320" muted autoplay loop></video>
  </div>
  <div>
    <canvas id="canvas1" class="placeholder"></canvas>
    <canvas id="canvas2" class="placeholder"></canvas>
    <canvas id="canvas" class="placeholder"></canvas>
    <select id="select">
      <option value="d">Dissolve</option>
      <option value="h">Horizontal Wipe</option>
      <option value="v">Vertical Wipe</option>
      <option value="c">Circular Wipe</option>
    </select>
  </div>
`

const video1 = document.querySelector('#video1');
const video2 = document.querySelector('#video2');
const select = document.querySelector('#select');
let readyFlg = 0;

const makeMask = (size, startTime=4, period=5) => {
  
  const type = select.value;
  const time = video1.currentTime - startTime;
  const color = new cv.Scalar(1, 1, 1);
  let pos = Math.max(0, time);
  pos = Math.min(pos, period);

  const mask1 = new cv.Mat.zeros(size, cv.CV_32FC3);
  if(type == 'd'){
    mask1.data32F.fill((period - pos) / period);
  } else if (type == 'h') {
    const w = Math.floor(video1.width * pos / period);
    cv.rectangle(mask1, new cv.Point(w, 0),
      new cv.Point(size.width-1, size.height-1), color, cv.FILLED);
  } else if (type == 'v') {
    const h = Math.floor(video1.height * pos / period);
    cv.rectangle(mask1, new cv.Point(0, h),
      new cv.Point(size.width-1, size.height-1), color, cv.FILLED);
  } else if (type == 'c') {
    const rMax = Math.hypot(size.width/2, size.height/2);
    const r = Math.floor(rMax * (period - pos) / period);
    cv.circle(mask1, new cv.Point(Math.floor(size.width/2), 
      Math.floor(size.height/2)), r, color, cv.FILLED);
  }
  cv.blur(mask1, mask1, new cv.Size(17, 17));

  const mask2 = new cv.Mat();
  mask1.convertTo(mask2, -1, -1, 1);
  return [mask1, mask2];
}

const showFloat32Image = (canvasID, src) => {
  const dst = new cv.Mat();
  src.convertTo(dst, cv.CV_8UC3, 255);
  cv.imshow(canvasID, dst);
  dst.delete();
}

const readFrameAsFloat32 = (videoEle, size) => {
  const cap = new cv.VideoCapture(videoEle);
  const src = new cv.Mat(size, cv.CV_8UC4);
  cap.read(src);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
  src.convertTo(src, cv.CV_32FC3, 1 / 255);
  return src;
}

const perFrame = () => {
  if (readyFlg != 7) {
    return;
  }

  const size = new cv.Size(video1.width, video1.height);
  const src1 = readFrameAsFloat32(video1, size);
  const src2 = readFrameAsFloat32(video2, size);

  const [mask1, mask2] = makeMask(size);
  showFloat32Image('canvas1', mask1);
  showFloat32Image('canvas2', mask2);

  cv.multiply(src1, mask1, src1);
  cv.multiply(src2, mask2, src2);
  const dst = new cv.Mat();
  cv.add(src1, src2, dst);
  showFloat32Image('canvas', dst);

  [src1, src2, mask1, mask2, dst].forEach(mat => mat.delete());
  video1.requestVideoFrameCallback(perFrame);
}

const video1Ready = () => {
  readyFlg |= 2;
  video1.width = video1.offsetWidth;
  video1.height = video1.offsetHeight;
  perFrame();
}

const video2Ready = () => {
  readyFlg |= 4;
  video2.width = video2.offsetWidth;
  video2.height = video2.offsetHeight;
  perFrame();
}

const opencvReady = () => {
  readyFlg |= 1;
  perFrame();
}

video1.addEventListener('loadeddata', video1Ready);
video2.addEventListener('loadeddata', video2Ready);

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