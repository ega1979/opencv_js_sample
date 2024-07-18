import './style.scss'
import capelMovie from './img/capel.mp4'
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
  <h1>Composite video frames and images</h1>
  <div>
    <img id="image" width="320" src="${capelImage}" alt="image" />
    <video id="video" width="320" src="${capelMovie}" controls autoplay muted></video>
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
`

const image = document.querySelector('#image');
const video = document.querySelector('#video');
let isReady = 0;
let src, star;
let frameCbHandle;
let period = 5;

const perFrame = () => {
  const cap = new cv.VideoCapture(video);
  cap.read(src);
  cv.imshow('canvas', src);

  const time = video.currentTime % period;
  const speed = (src.cols - star.cols) / period;
  const accel = (src.rows / 2) / (period ** 2);
  const x = (src.cols - star.cols) - speed * time;
  const y = accel * (time ** 2);
  const rect = new cv.Rect(x, y, star.cols, star.rows);
  const roi = src.roi(rect);
  cv.add(roi, star, roi);
  cv.imshow('canvas', src);
  frameCbHandle = video.requestVideoFrameCallback(perFrame);
}

const stop = () => {
  console.log('video is stopped');
  [src, star].forEach((mat) => mat.delete());
  video.removeEventListener('pause', stop);
  video.removeEventListener('ended', stop);
  video.cancelVideoFrameCallback(frameCbHandle);
}

const init = () => {
  if(isReady !== 7) return;

  src = new cv.Mat(video.height, video.width, cv.CV_8UC4);

  const img = cv.imread(image);
  star = new cv.Mat();
  cv.resize(img, star, new cv.Size(), 1/10, 1/10);
  img.delete();

  video.addEventListener('pause', stop);
  video.addEventListener('ended', stop);
  perFrame();
}

const videoReady = () => {
  console.log('video is ready');
  isReady |= 4;
  video.width = video.offsetWidth;
  video.height = video.offsetHeight;
  init();
}

const imageReady = () => {
  console.log('image is ready');
  isReady |= 2;
  init();
}

const opencvReady = () => {
  console.log('opencv is ready');
  isReady |= 1;
  init();
}

if(image.complete) isReady |= 2;

image.addEventListener('load', imageReady);
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