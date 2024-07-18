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
  <h1>Draw Tool</h1>
  <div id="container">
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
  <div style="margin-bottom: 40px;">
    <select id="select"></select>
  </div>
  <div>
    <button id="clear">Clear</button>
  </div>
`

const canvas = document.querySelector('#canvas');
canvas.width = 320;
canvas.height = 240;
const select = document.querySelector('#select');
const clear = document.querySelector('#clear');

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
let mat;

const colors = {
  white: [255, 255, 255],
  blue: [0, 0, 255],
  red: [255, 0, 0],
  purple: [255, 0, 255],
  green: [0, 255, 0],
  cyan: [0, 255, 255],
  yellow: [255, 255, 0]
};

let selectedColor = 'white';

const colorOptions = (p) => {
  Object.keys(colors).forEach((c) => {
    const ele = document.createElement('option');
    ele.value = c;
    ele.innerHTML = c;
    select.appendChild(ele);
  });
}

const selectColor = (e) => {
  selectedColor = e.target.value;
  console.log('Color: ', selectedColor);
}

const paint = (e) => {
  // if(e.altKey){
  //   mat.delete();
  //   console.log('Mat released. Refresh to restart');
  //   canvas.removeEventListener('mousemove', paint);
  //   return

  // } else if(! e.ctrlKey) {
  //   return;
  // }
  //console.log("e: ", e);
  if (!isDrawing) return;

  let [r, g, b] = colors[selectedColor];
  let x, y;

  if(e.touches) {
    const rect = e.target.getBoundingClientRect();
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.offsetX;
    y = e.offsetY;
  }

  // 色の選択
  select.addEventListener('change', selectColor);
  colorOptions();

  let pos = (e.offsetX + e.offsetY * canvas.width) * mat.channels();
  mat.data[pos] = r;
  mat.data[pos + 1] = g;
  mat.data[pos + 2] = b;
  cv.imshow('canvas', mat);
}

const imgProc = () => {
  console.log('imgProc start');
  mat = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC3);
  console.log('cv success');
  mat.setTo(new cv.Scalar(0, 0, 0));
};

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    console.log('Module initialized');
    //imgProc();
    if (cv) {
      imgProc();
    } else {
      console.error('cv is not defined');
    }
   }, 
};

// マウスイベントリスナー
canvas.addEventListener('mousedown', () => { isDrawing = true; });
canvas.addEventListener('mouseup', () => { isDrawing = false; });
canvas.addEventListener('mousemove', paint);

// タッチイベントリスナー
canvas.addEventListener('touchstart', () => { isDrawing = true; });
canvas.addEventListener('touchend', () => { isDrawing = false; });
canvas.addEventListener('touchmove', paint);

// キーボードイベントリスナー
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    mat.setTo(new cv.Scalar(0, 0, 0)); // 白でクリア
    cv.imshow('canvas', mat);
  }
});

// クリアボタンのクリックイベントリスナー
clear.addEventListener('click', () => {
  mat.setTo(new cv.Scalar(0, 0, 0)); // 黒でクリア
  cv.imshow('canvas', mat);
});