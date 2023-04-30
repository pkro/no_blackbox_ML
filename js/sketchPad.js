"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SketchPad_instances, _SketchPad_addMouseCoordsToPath, _SketchPad_redraw, _SketchPad_addEventListeners;
class SketchPad {
    constructor(container, size = 400) {
        _SketchPad_instances.add(this);
        this.canvas = document.createElement("canvas");
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.setAttribute('style', `
            background-color: white;
            box-shadow: 0 0 10px 2px black;
        `);
        container.appendChild(this.canvas);
        this.rect = this.canvas.getBoundingClientRect();
        this.ctx = this.canvas.getContext('2d');
        this.path = [];
        this.isDrawing = false;
        __classPrivateFieldGet(this, _SketchPad_instances, "m", _SketchPad_addEventListeners).call(this);
    }
}
_SketchPad_instances = new WeakSet(), _SketchPad_addMouseCoordsToPath = function _SketchPad_addMouseCoordsToPath(evt) {
    const mouse = [
        Math.round(evt.clientX - this.rect.left),
        Math.round(evt.clientY - this.rect.top)
    ];
    this.path.push(mouse);
}, _SketchPad_redraw = function _SketchPad_redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}, _SketchPad_addEventListeners = function _SketchPad_addEventListeners() {
    this.canvas.onmousedown = evt => {
        __classPrivateFieldGet(this, _SketchPad_instances, "m", _SketchPad_addMouseCoordsToPath).call(this, evt);
        this.isDrawing = true;
    };
    this.canvas.onmousemove = evt => {
        if (this.isDrawing) {
            __classPrivateFieldGet(this, _SketchPad_instances, "m", _SketchPad_addMouseCoordsToPath).call(this, evt);
            console.log(this.path.length);
        }
    };
    this.canvas.onmouseup = () => {
        this.isDrawing = false;
        this.path = [];
    };
};
