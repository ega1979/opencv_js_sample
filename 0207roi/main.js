import './style.scss'
import mashroomImage from './img/mashroom.png';

document.querySelector('#app').innerHTML = `
  <h1>Region of Interest</h1>
  <div id="container">
    <img id="image" width="320" src="${mashroomImage}" alt="image" />
    <canvas id="canvas"></canvas>
    <canvas id="canvas2"></canvas>
  </div>
`

const image = document.getElementById('image'),
canvas = document.getElementById('canvas'),
canvas2 = document.getElementById('canvas2');

let rs, src;

setTimeout(() => {
  if(src != undefined) {
    src.delete();
    src = undefined;
    console.log('<img> cv.Mat deleted');
  }
}, 60000);

const imgProc = (e) => {
  console.log('imgProc');
  if(! src || ! rs){ return };
  
  let mat = src.clone();

  const [x, y, width, height] = e.detail;
  console.log(`ROI: ${e.detail}`);
  const rect = new cv.Rect(x, y, width, height);
  const roi = mat.roi(rect);
  cv.imshow('canvas', roi);

  cv.blur(roi, roi, new cv.Size(110, 110));
  cv.imshow('canvas2', mat);

  mat.delete();
  roi.delete();
};

const resourceReady = (RegionSelect) => {
  console.log('resourceReady');
  rs = new RegionSelect('image');
  console.log('resourceReady2:', rs);
  image.addEventListener('regionselect', imgProc);
  console.log('resourceReady3');
};

const opencvReady = () => {
  console.log('opencvReady');
  src = cv.imread(image);
};

window.addEventListener('load', () => {
  // Moduleを先にグローバルスコープに設定
  window.Module = {
    onRuntimeInitialized: opencvReady
  };
  // 非同期インポートと初期化処理
  (async () => {
    try {
      const [{ default: RegionSelect }, opencv] = await Promise.all([
        import('./js/regionselect.js'),
        import('./js/opencv.js')
      ]);
      console.log('import success', { RegionSelect, opencv });

      // RegionSelectの初期化
      resourceReady(RegionSelect);

    } catch (error) {
      console.error('Error loading scripts:', error);
    }
  })();
});