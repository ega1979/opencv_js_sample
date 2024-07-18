/** <img> や <video> の上に文字列を含んだ <span> を重畳します。
 */
class Overlay {

    /** コンストラクタ。これを呼び出すと、第1引数の要素の上に文字列が表示される。
     * @param {string} divOuterTag - 重畳先の要素のタグのID。<div> を想定
     * @param {string} text - 表示文字列
     * @param {number} x - 重畳先要素内の水平位置（px）
     * @param {number} y - 重畳先要素内の垂直位置（px）
     * @param {number} fontSize - 描画文字列のフォントサイズ（px）
     * @param {string} color - 文字色
     * @param {string} bgcolor - 背景色
     */
    constructor(divOuterTag, text = 'Hello World', x = 0, y = 0,
        fontSize = 48, color = 'white', bgcolor = 'transparent') {
        this.divOuterElem = document.getElementById(divOuterTag); // 外側のDIV
        this.spanElem = document.createElement('span');           // その中の新規SPAN

        this.divOuterElem.style.position = 'relative';

        this.spanElem.style.position = 'absolute';
        this.spanElem.style.top = `${y}px`;
        this.spanElem.style.left = `${x}px`;
        this.spanElem.style.fontFamily = '"メイリオ", "Meiryo"';
        this.spanElem.style.fontSize = `${fontSize}px`;
        this.spanElem.style.color = color;
        this.spanElem.style.backgroundColor = bgcolor;
        this.spanElem.innerHTML = text;

        this.divOuterElem.appendChild(this.spanElem)
    }

    show() {
        this.spanElem.style.display = 'inline';
    }

    hide() {
        this.spanElem.style.display = 'none';
    }

    changeText(text, fontSize = -1, x = -1, y = -1) {
        this.spanElem.innerHTML = text;
        if (fontSize >= 0)
            this.spanElem.style.fontSize = `${fontSize}px`;
        if (x >= 0)
            this.spanElem.style.left = `${x}px`;
        if (y >= 0)
            this.spanElem.style.top = `${y}px`;
    }
}
export default Overlay;