import './style.scss'
// ダイナミックインポートを使用してopencv.jsを非同期に読み込む
(async () => {
  try {
    await import('./js/opencv.js');
  } catch (error) {
    console.error('Error loading opencv.js:', error);
  }
})();

document.querySelector('#app').innerHTML = `
  <h1>Copy canvas</h1>
  <div>
    <img id="image" width="320" src="./img/mashroom.png" alt="mashroom">
    <canvas id="canvas" class="placeholder"></canvas>
    <canvas id="canvas2" class="placeholder"></canvas>
  </div>
  `

const image = document.querySelector('#image');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const createCanvas = () => {
  image.style.display = 'none';
  const aspect = image.naturalHeight / image.naturalWidth;
  image.height = Math.floor(image.width * aspect);
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0, image.width, image.height);
  ctx.font = '24px sans-serif';
  ctx.strokeStyle = 'white';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.strokeText('Mashroom is so good!',
    canvas.width / 2, canvas.height / 2);
};

const imgProc = () => {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const mat = cv.matFromImageData(imgData);
  cv.imshow('canvas2', mat);
  mat.delete();
}

window.addEventListener('load', createCanvas);

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    if (window.cv) {
      imgProc();
    } else {
      console.error('cv is not defined');
    }
  }
};