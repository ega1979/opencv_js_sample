import './style.scss'
import matsumotoVideo from './img/matsumoto.mp4'
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
  <h1>Video Miniture</h1>
  <div>
    <video id="video" src="${matsumotoVideo}" width="320" controls muted autoplay loop></video>
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
  <div>
    <label>Vividness(1-3)</label>
    <input type="range" id="vivid" min="1" max="3" step="0.1" value="1">
    <span id="spanV" class="currentValue">1</span><br>
    <label>Brightness(1-3)</label>
    <input type="range" id="bright" min="1" max="3" step="0.1" value="1">
    <span id="spanB" class="currentValue">1</span><br>
    <label>Skipped(1-6)</label>
    <input type="range" id="skip" min="1" max="6" value="1">
    <span id="spanS" class="currentValue">1</span><br>
  </div>
`

const video = document.querySelector('#video');
const vivid = document.querySelector('#vivid');
const bright = document.querySelector('#bright');
const skip = document.querySelector('#skip');
const spanV = document.querySelector('#spanV');
const spanB = document.querySelector('#spanB');
const spanS = document.querySelector('#spanS');


let isReady = 0;
let size, rect;
let conter = 0;

const brighter = (src, scales=[1, 1, 1]) => {
  const temp1 = new cv.Mat();
  cv.cvtColor(src, temp1, cv.COLOR_RGB2HSV);

  const mv = new cv.MatVector();
  cv.split(temp1, mv);

  const temp2 = new cv.Mat();
  for(let i = 0; i < mv.size(); i++) {
    if(scales[i] != 1){
      mv.get(i).convertTo(temp2, -1, scales[i], 0);
      mv.set(i, temp2);
    }
  }

  cv.merge(mv, temp2);
  cv.cvtColor(temp2, src, cv.COLOR_HSV2RGB);

  [temp1, mv, temp2].forEach(m => m.delete());
}

const perFrame = () => {
  const cap = new cv.VideoCapture(video);

  let saturation = Number(vivid.value);
  let brightness = Number(bright.value);
  let gap = Number(skip.value);
  spanV.innerHTML = saturation;
  spanB.innerHTML = brightness;
  spanS.innerHTML = gap;

  if(conter % gap == 0){

    let src = new cv.Mat(size, cv.CV_8UC4);
    cap.read(src);
    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
    let dst = new cv.Mat();
    cv.bilateralFilter(src, dst, 5, 150, 150, cv.BORDER_DEFAULT);
    brighter(dst, [1, saturation, brightness]);

    src = dst.clone();
    cv.blur(src, src, new cv.Size(7, 7));
    let roiSrc = src.roi(rect);
    let roiDst = dst.roi(rect);
    roiDst.copyTo(roiSrc);

    cv.imshow('canvas', src);
    [src, dst, roiSrc, roiDst].forEach(m => m.delete());
  }
  conter++;
  video.requestVideoFrameCallback(perFrame);
}

const init = () => {
  if(isReady != 3){ return };

  size = new cv.Size(video.width, video.height);

  const ratio = 0.7;
  const w = Math.floor(video.width * ratio);
  const h = Math.floor(video.height * ratio);
  const x = Math.floor((video.width - w) / 2);
  const y = Math.floor((video.height - h) / 2);
  rect = new cv.Rect(x, y, w, h);
  perFrame();
}


const videoReady = () => {
  isReady |= 2;
  video.width = video.offsetWidth;
  video.height = video.offsetHeight;
  init();
}

const opencvReady = () => {
  isReady |= 1;
  init();
}

video.addEventListener('loadeddata', videoReady);

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