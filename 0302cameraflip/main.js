import './style.scss'

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
  <h1>Video Flip</h1>
  <div>
    <video id="video"controls></video>
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
`

const video = document.querySelector('#video');
let isReady = 0;
let frameCallbackId;

const constraints = {
  audio: false,
  video: { width: 320, height: 240 }
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
  video.srcObject = stream;
  video.play();
});

const perFrame = () => {
  if(isReady !== 3) return;

  const cap = new cv.VideoCapture(video);
  const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  cap.read(src);
  //cv.flip(src, src, 0);
  cv.rotate(src, src, cv.ROTATE_90_CLOCKWISE);
  cv.imshow('canvas', src);

  src.delete();
  frameCallbackId = video.requestVideoFrameCallback(perFrame);
}

const videoStop = () => {
  console.log('video is stopped');
  video.pause();
  const tracks = video.srcObject.getVideoTracks();
  tracks[0].stop();
  video.srcObject = null;
  video.removeEventListener('pause', videoStop);
  video.cancelVideoFrameCallback(frameCallbackId);
  isReady = 0;
}


const videoReady = () => {
  console.log('camera started');
  isReady |= 2;
  video.width = video.offsetWidth;
  video.height = video.offsetHeight;
  video.addEventListener('pause', videoStop);
  perFrame();
}

const opencvReady = () => {
  console.log('opencv is ready');
  isReady |= 1;
  perFrame();
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