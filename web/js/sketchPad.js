"use strict";
class SketchPad {
    canvas;
    rect;
    ctx;
    path;
    isDrawing;
    constructor(container, size = 400) {
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
        this.#addEventListeners();
    }
    #addEventListeners() {
        this.canvas.onmousedown = evt => {
            this.#addMouseCoordsToPath(evt);
            this.isDrawing = true;
        };
        this.canvas.onmousemove = evt => {
            if (this.isDrawing) {
                this.#addMouseCoordsToPath(evt);
                this.#redraw();
            }
        };
        this.canvas.onmouseup = () => {
            this.isDrawing = false;
            this.path = [];
        };
    }
    #addMouseCoordsToPath(evt) {
        const mouse = [
            Math.round(evt.clientX - this.rect.left),
            Math.round(evt.clientY - this.rect.top)
        ];
        this.path.push(mouse);
    }
    #redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        draw.path(this.ctx, this.path);
    }
}
