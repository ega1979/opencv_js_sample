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
  <h1>Color Hue</h1>
  <div>
    <canvas id="canvas1" class="placeholder"></canvas><br>
    <canvas id="canvas2" class="placeholder"></canvas>
  </div>
`;
const [width, height] = [320, 180];

const cssDraw = () => {
  console.log('cssDraw');

  const canvas2 = document.querySelector('#canvas2');
  canvas2.width = width;
  canvas2.height = height;
  const ctx2 = canvas2.getContext('2d');
  for(let i = 0; i < height; i++) {
    ctx2.strokeStyle = `hsl(${i*2}, 100%, 50%)`;
    ctx2.lineWidth = 1;
    ctx2.beginPath();
    ctx2.moveTo(0, i);
    ctx2.lineTo(width-1, i);
    ctx2.stroke();
  }
};
cssDraw();

const imgProc = () => {
  console.log('imgProc');

  let array = [];
  
  for(let i=0; i<height; i++) {
    const color = [i, 255, 255];
    const line = new Array(width).fill(color);
    array.push(line);
  }
  console.log('imgProc2');
  const flat_array = array.flat(Infinity);
  const mat = cv.matFromArray(height, width, cv.CV_8UC3, flat_array);

  cv.cvtColor(mat, mat, cv.COLOR_HSV2RGB);
  cv.imshow('canvas1', mat);
  mat.delete();
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