import './style.scss'
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
  <h1>Image Blur</h1>
  <div>
    <img id="image" width="320" src="${capelImage}" alt="image" />
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
  <div>
    <select id="select">
      <option value="blur">ぼかし</option>
      <option value="gaussian">ガウシアンフィルタ</option>
      <option value="median">メディアン(中間値)フィルタ</option>
      <option value="bilateral">バイラテラルフィルタ</option>
    </select>
  </div>
`

const image = document.querySelector('#image')
const select = document.querySelector('#select')


const imgProc = (e) => {
  console.log('imgProc');
  let filter = 'blur';
  if (e){ filter = e.target.value };
  console.log(`Filter: ${filter}`);

  const src = cv.imread(image);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
  const dst = new cv.Mat();
  const ksize = 7;
  const ksizeBox = new cv.Size(ksize, ksize);

  switch (filter) {
    case 'blur':
      console.log('blur');
      cv.blur(src, dst, ksizeBox);
      break;
    case 'gaussian':
      console.log('gaussian');
      cv.GaussianBlur(src, dst, ksizeBox, 5.0);
      break;
    case'median':
      console.log('median');
      cv.medianBlur(src, dst, ksize);
      break;
    case 'bilateral':
      console.log('bilateral');
      cv.bilateralFilter(src, dst, ksize, 150, 150, cv.BORDER_DEFAULT);
      break;
    default:
      console.log('default');
      break;
  }
  
  cv.imshow('canvas', dst);
  src.delete();
  dst.delete();
};

const opencvReady = () => {
  console.log('OpenCV.js is ready');
  select.addEventListener('change', imgProc);
  imgProc();
};

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