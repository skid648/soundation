'use strict';

export default class Pixels {
    /*
     _image = null;
     _data = null;
     _width = null;
     _height = null;
     */
    constructor(imageData) {
        this.image = imageData;
    }

    set image(imageData) {
        this._image = imageData;
        if (imageData) {
            this._data = imageData.data;
            this._width = imageData.width;
            this._height = imageData.height;
        } else {
            this._data = null;
            this._width = NaN;
            this._height = NaN;
        }
    }

    get image() {
        return this._image;
    }

    getPixelPosition(x, y) {
        return (y * this._width + x);
    }

    getPixelPositionRaw(x, y) {
        return (y * this._width + x) * 4;
    }

    getPixel(x, y) {
        const pos = this.getPixelPositionRaw(x, y);
        return this._data[pos] << 24 | this._data[pos + 1] << 16 | this._data[pos + 2] << 8 | this._data[pos + 3];
        //return this.getPixelByPosition(this.getPixelPosition(x, y));
    }

    getPixelAlpha(x, y) {
        const pos = this.getPixelPositionRaw(x, y);
        return this._data[pos + 3];
    }

    getPixelByPosition(pos) {
        pos *= 4;
        return this._data[pos] << 24 | this._data[pos + 1] << 16 | this._data[pos + 2] << 8 | this._data[pos + 3];
    }

    get length() {
        return this._width * this.height;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    setPixel(x, y, color) {
        const pos = this.getPixelPositionRaw(x, y);
        this._data[pos] = color >> 24 & 0xff;
        this._data[pos + 1] = color >>> 16 & 0xff;
        this._data[pos + 2] = color >>> 8 & 0xff;
        this._data[pos + 3] = color & 0xff;
        //this.setPixelByPosition(this.getPixelPosition(x, y), color);
    }

    setPixelByPosition(pos, color) {
        pos *= 4;
        this._data[pos] = color >> 24 & 0xff;
        this._data[pos + 1] = color >>> 16 & 0xff;
        this._data[pos + 2] = color >>> 8 & 0xff;
        this._data[pos + 3] = color & 0xff;
    }

    valueOf() {
        return this._image;
    }

    *[Symbol.iterator]() {
        const length = this.length;
        for (let index = 0; index < length; index++) {
            yield this.getPixelByPosition(index);
        }
    }
}