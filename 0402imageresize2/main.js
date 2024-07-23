import './style.scss'
import mashroomImage from './img/mashroom.png'

(async () => {
  try {
    const [{ default: RegionSelect }, opencv] = await Promise.all([
      import('./js/regionSelect.js'),
      import('./js/opencv.js')
    ]);
    console.log('import success', { RegionSelect, opencv });

    // Moduleを先にグローバルスコープに設定
    window.Module = {
      onRuntimeInitialized: opencvReady
    };

    // RegionSelectの初期化
    resourceReady(RegionSelect);

  } catch (error) {
    console.error('Error loading scripts:', error);
  }
})();

document.querySelector('#app').innerHTML = `
  <h1>Image Resize / Mosaic</h1>
  <div>
    <img id="image" width="320" src="${mashroomImage}" alt="image" /><br>
    <canvas id="canvasRoi" width="100" class="placeholder"></canvas>
    <canvas id="canvasMosaic" width="100" class="placeholder"></canvas><br>
    <canvas id="canvas" width="320" class="placeholder"></canvas>
  </div>
  <div>
    Mosaic: <input id="range" type="range" min="2" value="10" max="30" />
  </div>
`

const image = document.querySelector('#image')
const range = document.querySelector('#range')
let region = [79, 60, 100, 85]; // [x, y, width, height]
let readyFlg = 0
let rs, src, roi, rect

const imgProc = (e) => {
  console.log('imgProc')
  if(readyFlg != 3){ return }
  
  if(e.type === 'regionselect'){ 
    region = e.detail 
  }

  src = cv.imread(image);
  rect = new cv.Rect(...region);
  roi = src.roi(rect);
  cv.imshow('canvasRoi', roi)
  
  const scale = Number(range.value)
  const mat = new cv.Mat()
  cv.resize(roi, mat, new cv.Size(), 1/scale, 1/scale)
  cv.resize(mat, mat, new cv.Size(region[2], region[3]), 0, 0, cv.INTER_NEAREST)
  mat.copyTo(roi)
  cv.imshow('canvasMosaic', mat)
  cv.imshow('canvas', src)

  mat.delete();
  roi.delete();
  src.delete();
};

const resourceReady = (RegionSelect) => {
  console.log('resoueceReady');
  readyFlg |= 1;
  rs = new RegionSelect('image')
  image.addEventListener('regionselect', imgProc) 
  range.addEventListener('input', imgProc)
}

const opencvReady = () => {
  console.log('opencvReady');
  readyFlg |= 2;
  range.dispatchEvent(new InputEvent('input'));
}

window.addEventListener('load', () => {
  // Moduleを先にグローバルスコープに設定
  window.Module = {
    onRuntimeInitialized: opencvReady
  };
});