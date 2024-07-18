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
  <h1>The list of functions in opencv.js</h1>
  <div>
    <pre id="pre">Loading...</pre>
  </div>
`
const pre = document.querySelector('#pre');

const listfunctions = () => {
  const keys = Object.keys(cv);
  console.log(`cv has ${keys.length} functions`);

  const functions = keys.filter((key) => {
    const isFunction = typeof cv[key] === 'function';
    const isDyncall = key.startsWith('dynCall_');
    const isDunner = key.startsWith('__');
    return isFunction && !isDyncall && !isDunner;
  }).sort();
  console.log(`${functions.length} functions in cv`);
  pre.innerHTML = functions.join('\n');
}

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    if (window.cv) {
      listfunctions();
    } else {
      console.error('cv is not defined');
    }
  }
};