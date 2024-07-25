import './style.scss'
import logoImage from './img/logo.png'

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
  <h1>Analyze RGB color</h1>
  <div>
    <img id="image" width="320" src="${logoImage}" alt="image"/><br>
  </div>
  <div>
    <div class="inline">
      <canvas id="canvas1" class="placeholder"></canvas>
      <label id="label1">R</label>
    </div>
    <div class="inline">
      <canvas id="canvas2" class="placeholder"></canvas>
      <label id="label2">G</label>
    </div>
    <div class="inline">
      <canvas id="canvas3" class="placeholder"></canvas>
      <label id="label3">B</label>
    </div>
  </div>
`
const image = document.querySelector('#image');


const imgProc = () => {
  console.log('imgProc');

  const src = cv.imread(image);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);

  const dst = new cv.MatVector();
  cv.split(src, dst);
  for(let i=0; i<dst.size(); i++) {
    console.log(`canvas${i+1}`, dst.get(i));
    cv.imshow(`canvas${i+1}`, dst.get(i));
  }

  console.log('cv.mean:', cv.mean(src));

  [src, dst].forEach((m) => m.delete());
};

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    console.log('Module initialized');
    if (cv) {
      imgProc();
    } else {
      console.error('cv is not defined');
    }
  },
};