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
  <h1>The list of consts of opencv.js</h1>
  <div>
    <select id="select">
      <option value="noop selected">Select a const</option>
      <option value="^CV_\d{1,2}[SUF]">データ型</option>
      <option value="^COLOR">色空間変換</option>
      <option value="^THRESH">閾値</option>
      <option value="^INTER">ピクセル値補間方法</option>
      <option value="^BORDER">画像端外挿方法</option>
      <option value="^LINE">描画線種</option>
      <option value="^MORPH">モルフォロジー演算タイプ</option>
      <option value="^OPTFLOW">オプティカルフロー操作タイプフラグ</option>
    </select>
  </div>
  <div>
    <pre id="pre"Const list</pre>
  </div>
`
const select = document.querySelector('#select');
const pre = document.querySelector('#pre');

const showConst = (e) => {
  const re = new RegExp(e.target.value);
  const keys = Object.keys(cv);

  const selected = keys.filter((el) => {
    return re.test(el);
  }).sort();

  pre.innerHTML = selected.map((el) => {
    return `${el} = ${cv[el]}`;
  }).join('\n');

  console.log(`RegExp: ${re} extracted ${selected.length} keys`);
};

const opencvReady = () => {
  select.addEventListener('change', showConst);
};

// Moduleを先にグローバルスコープに設定
window.Module = {
  onRuntimeInitialized: () => {
    if (window.cv) {
      opencvReady();
    } else {
      console.error('cv is not defined');
    }
  }
};