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
  <h1>Video Mog2</h1>
  <div>
    <video id="video" src="${matsumotoVideo}" width="320"></video><br>
    <canvas id="canvas" class="placeholder"></canvas><br>
    <canvas id="canvas2" class="placeholder"></canvas>
  </div>
`

const video = document.querySelector('#video');
let src4, src3, fg, dst;
let mog2;
let frameCallbackHandle;
let readyFlg;

const perFrame = () => {
  const cap = new cv.VideoCapture(video);
  cap.read(src4);
  cv.cvtColor(src4, src3, cv.COLOR_RGBA2RGB);
  mog2.apply(src3, fg);
  cv.imshow('canvas', fg);
  dst.data.fill(128);
  src3.copyTo(dst, fg);
  cv.imshow('canvas2', dst);

  frameCallbackHandle = video.requestVideoFrameCallback(perFrame);
}

const stop = () => {
  [src4, src3, fg, dst].forEach(mat => mat.delete());
  video.cancelVideoFrameCallback(frameCallbackHandle);
  video.removeEventListener('pause', stop);
  video.removeEventListener('ended', stop);
  readyFlg = 0;
}

const init = () => {
  if (readyFlg !== 3) {
    return;
  }
  src4 = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  src3 = new cv.Mat(video.height, video.width, cv.CV_8UC3);
  fg = new cv.Mat(video.height, video.width, cv.CV_8UC1);
  dst = new cv.Mat(video.height, video.width, cv.CV_8UC3);
  mog2 = new cv.BackgroundSubtractorMOG2();
  video.muted = true;
  video.loop = true;
  video.play();
  perFrame();
}

const videoReady = () => {
  readyFlg |= 2;
  video.width = video.offsetWidth;
  video.height = video.offsetHeight;
  init();
}

const opencvReady = () => {
  readyFlg |= 1;
  init();
}

video.addEventListener('loadeddata', videoReady);
video.addEventListener('pause', stop);
video.addEventListener('ended', stop);

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