

/**
 * Zooms stuff
 */
export default class ZoomCanvas {
    pos = { x: 0, y: 0 };
    actualDim = { w: 200, h: 200 };
    zoomLvl = 2;
    ogCanvas = null;
    zoomCanvas = null;
    animated = true;


    constructor() {

    }

    /**
     * Updates cavasltt's pos property with the mouses position in the watched canvas.
     * Also pauses/unpauses zoom canvas when pressing control + click on a pixel.
     * @param {HTMLCanvasElement} canvas canvas to watch mouse position in.
     */
    watchCanvas(canvas) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = e.target.getBoundingClientRect();
            this.pos.x = e.clientX - rect.left;
            this.pos.y = e.clientY - rect.top;
        });

        canvas.addEventListener('click', (e) => {
            if (e.getModifierState("Control")) {
                if ((this.animated = !this.animated)) {
                    requestAnimationFrame((t) => this.zoomAnimateComplex(t));
                }
            }
        });
    }

    /**
     * 
     * @param {HTMLCanvasElement} ogCanv original canvas that the mouse is over
     * @param {HTMLCanvasElement} zoomCanv canvas to show the zoom in
     * @param {Number} zoomLvl the level of zoom
     */
    zoom(ogCanv, zoomCanv, zoomLvl = 10) {
        this.initZoomCanvas(ogCanv, this.zoomCanv, zoomLvl);
        // set smaller width, so we can use CSS pixelated image rendering to do the zooming for ussss
        this.zoomCanvas.width = Math.floor(this.actualDim.w / this.zoomLvl);
        this.zoomCanvas.height = Math.floor(this.actualDim.h / this.zoomLvl);
        this.zoomCanvas.style.imageRendering = 'pixelated';
        requestAnimationFrame((t) => this.zoomAnimate(t));
    }

    zoomPixel(ogCanv, zoomCanv, zoomLvl = 10) {
        this.initZoomCanvas(ogCanv, zoomCanv, zoomLvl);
        requestAnimationFrame((t) => this.zoomAnimateComplex(t));
    }

    initZoomCanvas(ogCanv, zoomCanv, zoomLvl = 10) {
        this.zoomLvl = zoomLvl;
        this.zoomCanvas = zoomCanv ??= this.makeCanvas();
        // set zoom image dimensions, should be the same size of the zoomCanvas given, if one is given
        this.actualDim = { w: this.zoomCanvas.width, h: this.zoomCanvas.height };
        // set canvas width/height style to blow it up.
        this.zoomCanvas.style.width = `${this.actualDim.w}px`;
        this.zoomCanvas.style.height = `${this.actualDim.h}px`;

        this.ogCanvas = ogCanv;
        this.watchCanvas(this.ogCanvas);
    }

    /**
     * On animation frame, gets the current slice of the image to zoom, 
     * then replaces the zoomCanvas with that slice of the image.
     * @param {DOMHighResTimeStamp} timestamp given by the requestAnimationFrame function
     */
    zoomAnimate(timestamp) {
        let ogImageSlice = this.getZoomedImageSlice();
        // put slice of image to zoom in the zoom canvas
        let zoomCtx = this.zoomCanvas.getContext('2d');
        zoomCtx.putImageData(ogImageSlice, 0, 0);
        // animte it!
        if (this.animated) {
            requestAnimationFrame((t) => this.zoomAnimate(t));
        }
    }
    
    zoomAnimateComplex(timestamp) {
        const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
        let ogImageSlice = this.getZoomedImageSlice();
        // put slice of image to zoom in the zoom canvas
        let zoomCtx = this.zoomCanvas.getContext('2d');
        let imgSliceSize = {
            w: Math.floor(this.actualDim.w / this.zoomLvl), 
            h: Math.floor(this.actualDim.h / this.zoomLvl)
        };
        let center = this.getCenterPoint({
            x: imgSliceSize.w,
            y: imgSliceSize.h
        });
        for (let i = 0; i < imgSliceSize.w; i++) {
            for (let j = 0; j < imgSliceSize.h; j++) {
                let x, y, index;
                x = i * this.zoomLvl;
                y = j * this.zoomLvl;
                index = 4 * (i + j * imgSliceSize.w);
                let color = [
                    ogImageSlice.data[index],
                    ogImageSlice.data[index + 1],
                    ogImageSlice.data[index + 2]
                ];
                zoomCtx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                zoomCtx.fillRect(x, y, this.zoomLvl, this.zoomLvl);

                
                let lineColor = [
                    clamp(color[0] + 50, 0, 255),
                    clamp(color[1] + 50, 0, 255),
                    clamp(color[2] + 50, 0, 255)
                ];

                zoomCtx.fillStyle =  `rgb(${lineColor[0]}, ${lineColor[1]}, ${lineColor[2]})`;
                zoomCtx.fillRect(x, y, this.zoomLvl, 1);
                zoomCtx.fillRect(x, y, 1, this.zoomLvl);
            }
        }
        // stroke the center pixel
        zoomCtx.strokeStyle = '#000000';
        zoomCtx.lineWidth = 4;
        zoomCtx.strokeRect(center.x * this.zoomLvl - 1, center.y * this.zoomLvl - 1, this.zoomLvl + 2, this.zoomLvl + 2);
        zoomCtx.strokeStyle = '#FFFFFF';
        zoomCtx.lineWidth = 2;
        zoomCtx.strokeRect(center.x * this.zoomLvl, center.y * this.zoomLvl, this.zoomLvl, this.zoomLvl);
        

        // animte it!
        if (this.animated) {
            requestAnimationFrame((t) => this.zoomAnimateComplex(t));
        }
    }

    setAnimation(animated, type) {
        this.animated = animated;
        if (!this.animated) return;
        if (type === 'complex') {
            requestAnimationFrame((t) => this.zoomAnimateComplex(t));
        }
        else if (type === 'simple') {
            requestAnimationFrame((t) => this.zoomAnimate(t));
        }
        else {
            console.log(`not animating, unknown type: ${type}`);
        }
    }

    getZoomedImageSlice() {
        const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
        // get size (width/height) of image slice to take from canvas
        let imgSliceSize = {
                w: Math.floor(this.actualDim.w / this.zoomLvl), 
                h: Math.floor(this.actualDim.h / this.zoomLvl)
            };
        // get start position of image slice 
        // (such that the pixel on the mouse is in the middle)
        // (start position is the top left pixel)
        let startPos = {
                x:    this.pos.x - Math.floor(imgSliceSize.w / 2), 
                y:    this.pos.y - Math.floor(imgSliceSize.h / 2)
            };
        // get slice of image to zoom
        let ogCtx = this.ogCanvas.getContext('2d', { willReadFrequently: true });
        return ogCtx.getImageData(
            startPos.x,
            startPos.y,
            imgSliceSize.w,
            imgSliceSize.h
        );
    }

    /**
     * Resize the zoom canvas given new dimensions (of canvas size after zoom/blowing up)
     * @param {Number} w new width in pixels
     * @param {Number} h new width in pixels
     */
    resize(w, h) {
        this.actualDim = { w: this.zoomCanvas.width, h: this.zoomCanvas.height };
        // set smaller width, so we can use CSS pixelated image rendering to do the zooming for ussss
        this.zoomCanvas.width = Math.floor(this.actualDim.w / this.zoomLvl);
        this.zoomCanvas.height = Math.floor(this.actualDim.h / this.zoomLvl);
    }

    getCenterPoint(size) {
        return { x: Math.floor(size.x / 2), y: Math.floor(size.y / 2) };
    }

    /**
     * 
     * @param {*} width 
     * @param {*} height 
     * @returns 
     */
    makeCanvas(width = 200, height = width) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    moveUp(step = 1) {
        this.pos.y -= step;
    }

    moveDown(step = 1) {
        this.pos.y += step;
    }

    moveLeft(step = 1) {
        this.pos.x -= step;
    }

    moveRight(step = 1) {
        this.pos.x += step;
    }

    getCurrentColor() {
        return this.getColor(this.ogCanvas, [this.pos.x, this.pos.y]);
    }

    getColor (canvas, pos) {
        let ctx = canvas.getContext('2d', { willReadFrequently: true });
        let image = ctx.getImageData(pos[0], pos[1], 1, 1);
        return [image.data[0], image.data[1], image.data[2]];
    }
    
}