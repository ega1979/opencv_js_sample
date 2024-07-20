/** <canvas> でマウス操作で矩形領域を選択し、(x, y, width, height) を regionselect カスタムイベント経由で返す。
 * 操作は、左マウスボタン押下でドラッグ。マウスを上げるとカスタムイベントが発生する。
 */
class RegionSelect {

    /** コンストラクタ
     * @param {string} imageTag - <img> のIDタグ
     */
    constructor(imageTag) {
        this.imgElem = document.getElementById(imageTag);
        let divElem = this.imgElem.parentElement;
        divElem.style.position = 'relative';

        let canvasElem = document.createElement('canvas');
        divElem.appendChild(canvasElem);
        this.ctx = canvasElem.getContext('2d');

        canvasElem.width = this.imgElem.offsetWidth;
        canvasElem.height = this.imgElem.offsetHeight;
        canvasElem.style.position = 'absolute';
        canvasElem.style.top = '0px';
        canvasElem.style.left = '0px';
        canvasElem.style.backgroundColor = 'transparent';
        canvasElem.style.zIndex = 2;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.mouseState = undefined;
        canvasElem.addEventListener('mousedown', () => this.mouseDown(event));
        canvasElem.addEventListener('mousemove', () => this.mouseMove(event));
        canvasElem.addEventListener('mouseup', () => this.mouseUp(event));
    }

    drawRectangle() {
        this.ctx.reset();
        this.ctx.setLineDash([5]);
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    mouseDown(evt) {
        if (this.mouseState === undefined) {
            this.mouseState = 'down';
            this.x = evt.offsetX;
            this.y = evt.offsetY;
            this.width = this.height = 0;
        }
    }

    mouseMove(evt) {
        if (this.mouseState === 'down') {
            this.width = evt.offsetX - this.x;
            this.height = evt.offsetY - this.y;
            this.drawRectangle();
        }
    }

    mouseUp(evt) {
        if (this.mouseState === 'down') {
            this.mouseState = undefined;
            if (this.width < 0) {
                this.x += this.width;
                this.width = Math.abs(this.width);
            }
            if (this.height < 0) {
                this.y += this.height;
                this.height = Math.abs(this.height);
            }
            let rect = [this.x, this.y, this.width, this.height];
            let regionSelect = new CustomEvent('regionselect', { detail: rect });
            this.imgElem.dispatchEvent(regionSelect);
        }
    }

} 
export default RegionSelect;