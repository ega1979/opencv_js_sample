import './style.scss'
import cupVideo from './img/cup.mp4'

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
  <h1>Opticalflow</h1>
  <div>
    <video id="video" src="${cupVideo}" width="320"></video><br>
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
`

const video = document.querySelector('#video');
let currC4, currC3, currU1, prevU1;
let flow;
let frameCallbackHandle;
let readyFlg = 0;
let sparse = 8;

const drawFlow = (img, flows, thresh=4) => {
  for(let y=0; y<flows.rows; y+=sparse) {
    for(let x=0; x<flows.cols; x+=sparse) {
      const [dx, dy] = flow.floatPtr(y, x);
      const l1 = Math.abs(dx) + Math.abs(dy);
      if(l1 > thresh) {
        cv.line(img,
            new cv.Point(x, y),
            new cv.Point(x + dx, y + dy),
            new cv.Scalar(10, 10, 10),
        );
      }
    }
  }
  const means = cv.mean(flows);
  const centerX = img.cols / 2;
  const centerY = img.rows / 2;
  const arrowScale = 50;
  cv.line(img,
      new cv.Point(centerX, centerY),
      new cv.Point(centerX + means[0] * arrowScale, centerY + means[1] * arrowScale),
      new cv.Scalar(255, 255, 255),
      3
  );
}

const perFrame = () => {
  const cap = new cv.VideoCapture(video);
  cap.read(currC4);
  cv.cvtColor(currC4, currC3, cv.COLOR_RGBA2RGB);
  cv.cvtColor(currC3, currU1, cv.COLOR_RGBA2GRAY);
  cv.calcOpticalFlowFarneback(prevU1, currU1, flow,
    0.5, 3, 13, 3, 5, 1.2, 0);

  drawFlow(currC3, flow);
  cv.imshow('canvas', currC3);
  prevU1 = currU1.clone();

  frameCallbackHandle = video.requestVideoFrameCallback(perFrame);
}

const stop = () => {
  console.log('video ended');
  [currC4, currC3, currU1, prevU1, flow].forEach(m => m.delete());
  video.cancelVideoFrameCallback(frameCallbackHandle);
  video.removeEventListener('pause', stop);
  video.removeEventListener('ended', stop);
  readyFlg = 0;
}

const init = () => {
  if (readyFlg !== 3) {
    return;
  }

  const w = video.width;
  const h = video.height;
  currC4 = new cv.Mat(h, w, cv.CV_8UC4);
  currC3 = new cv.Mat();
  currU1 = new cv.Mat();
  prevU1 = new cv.Mat(h, w, cv.CV_8UC1, new cv.Scalar(255));
  flow = new cv.Mat(h, w, cv.CV_32FC2);

  perFrame();
}

const videoReady = () => {
  video.width = video.offsetWidth;
  video.height = video.offsetHeight;
  video.playbackRate = 0.4;
  video.muted = true;
  video.loop = true;
  video.play();
  readyFlg |= 1;
  init();
}

const opencvReady = () => {
  readyFlg |= 2;
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