"use strict";
class SketchPad {
    canvas;
    rect;
    ctx;
    paths;
    isDrawing;
    undoBtn;
    constructor(container, onUpdate=null, size = 400) {
        this.onUpdate = onUpdate;
        this.onUpdate = onUpdate;
        this.canvas = document.createElement("canvas");
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.setAttribute('style', `
            background-color: white;
            box-shadow: 0 0 10px 2px black;
        `);
        container.appendChild(this.canvas);
        const lineBreak = document.createElement("br");
        const undoBtn = document.createElement('button');
        undoBtn.innerHTML = 'Undo';
        undoBtn.onclick = () => this.#undo();
        undoBtn.disabled = true;
        this.undoBtn = undoBtn;
        container.appendChild(lineBreak);
        container.appendChild(undoBtn);
        this.rect = this.canvas.getBoundingClientRect();
        this.ctx = this.canvas.getContext('2d');
        this.paths = [];
        this.isDrawing = false;
        this.#addEventListeners();
    }


    #addEventListeners() {
        this.canvas.onpointerdown = (evt) => {
            this.paths.push([]);
            this.#addMouseCoordsToPath(evt);
            this.isDrawing = true;
        };
        this.canvas.onpointermove = evt => {
            if (this.isDrawing) {
                this.#addMouseCoordsToPath(evt);
                this.#redraw();
            }
        };
        // we use document in case the user draws a line that ends outside the canvas, like an horizon
        document.onpointerup = () => {
            this.isDrawing = false;
        };
    }
    #addMouseCoordsToPath(evt) {
        const mouse = [
            Math.round(evt.clientX - this.rect.left),
            Math.round(evt.clientY - this.rect.top)
        ];
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse);
    }

    #redraw() {
        this.#clear();
        draw.paths(this.ctx, this.paths);
        this.undoBtn.disabled = this.paths.length === 0;

        this.triggerUpdate();
        
    }

    triggerUpdate() {
        if (this.onUpdate) {
            this.onUpdate(this.paths);
        }
    }

    #clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    #undo() {
        this.paths.pop();
        this.#redraw();
    }

    reset() {
        this.paths = [];
        this.isDrawing = false;
        this.#clear();
    }
}
