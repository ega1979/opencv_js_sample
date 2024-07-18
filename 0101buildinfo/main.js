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
  <h1>Build infomation of opencv.js</h1>
  <div>
    <pre id="pre">Loading...</pre>
  </div>
`
const pre = document.querySelector('#pre');

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    if (window.cv) {
      pre.innerHTML = window.cv.getBuildInformation();
    } else {
      console.error('cv is not defined');
    }
  }
};