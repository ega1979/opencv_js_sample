import './style.scss'
import mashroomImage from './img/mashroom.png';
// ダイナミックインポートを使用してopencv.jsを非同期に読み込む
(async () => {
  try {
    await import('./js/opencv.js');
  } catch (error) {
    console.error('Error loading opencv.js:', error);
  }
})();

document.querySelector('#app').innerHTML = `
  <h1>Examing the structure of an image</h1>
  <div>
    <img id="image" width="320" src="${mashroomImage}" alt="mashroom">
    <canvas id="canvas" class="placeholder"></canvas>
  </div>
  `

const image = document.querySelector('#image');

const imgProc = () => {
  const mat = cv.imread(image);
  cv.imshow('canvas', mat);

  console.log(`Image metadata
    width x height: ${image.width} x ${image.height}
    naturalWidth x naturalHeight: ${image.naturalWidth} x ${image.naturalHeight}  
  `);

  console.log(`Mat metadata:
    rows x cols: ${mat.rows} x ${mat.cols}
    size: ${mat.size().width} x ${mat.size().height}
    total: ${mat.total()}
    #cannels: ${mat.channels()}
    depth: ${mat.depth()} // cv.CV_8U = 0
    type: ${mat.type()}   // cv.CV_8UC4 = 24
    #data: ${mat.data.length}
  `);

  const matVector = new cv.MatVector();
  cv.split(mat, matVector);
  console.log('data: ', new Set(matVector.get(3).data));

  mat.delete();
  matVector.delete();
}

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