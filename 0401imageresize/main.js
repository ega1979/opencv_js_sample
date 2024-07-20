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
  <h1>Image Resize 1</h1>
  <div>
    <img id="image" width="320" src="${capelImage}" alt="image" />
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
  <div>
    <select id="select"></select>
  </div>
`

const image = document.querySelector('#image')
const select = document.querySelector('#select')

const addOptions = () => {
  const inter = Object.keys(cv).filter(prop => prop.startsWith('INTER_'));
  inter.forEach((e) => {
    const ele = new Option(e, cv[e]);
    select.appendChild(ele);
  })
}

const imgProc = (e) => {
  let inter = cv.INTER_LINEAR;
  if(e) { 
    inter = Number(e.target.value) 
  }
  const src = cv.imread(image);
  const dst = new cv.Mat();
  try {
    cv.resize(src, dst, new cv.Size(), 2, 2, inter);
  } catch (err) {
    console.log(`${inter} is not supported`);
  }
  cv.imshow('canvas', dst);
  src.delete();
  dst.delete();
};

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    console.log('Module initialized');
    if (cv) {
      addOptions();
      select.addEventListener('change', imgProc);
      imgProc();
    } else {
      console.error('cv is not defined');
    }
   }, 
};