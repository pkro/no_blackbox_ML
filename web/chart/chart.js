// possible optimizations / "homework":
// - highlight selected sample on a transparent canvas so other samples don't have to be drawn again
// - when dragging, render current on large canvas, cast to image and drag that instead of re-rendering
//   all points for every image
class Chart {
    constructor(container, samples, options, onClick = null) {
        this.samples = samples;
        this.axesLabels = options.axesLabels;

        this.canvas = document.createElement("canvas");
        this.canvas.width = options.size;
        this.canvas.height = options.size;
        this.styles = options.styles;
        this.icon = options.icon; // draw dots or use the text icons defined in styles
        this.bg = options.bg;
        this.canvas.style = "background-color: white;";
        this.hoveredSample = null;
        this.selectedSample = null;
        this.onClick = onClick; // optional callback when clicking on a sample, e.g. to highlight it in the table

        // a single point to display on the chart while drawing on the sketchpad
        this.dynamicPoint = null;
        this.nearestSamples = null;

        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        // a margin INSIDE the canvas, so it's more equivalent to css padding
        this.margin = options.size * 0.1;
        this.transparency = options.transparency || 1;

        // for drag / zoom
        this.dataTrans = {
            offset: [0, 0],
            scale: 1
        };

        this.dragInfo = {
            start: [0, 0], // drag start
            end: [0, 0], // drag end
            offset: [0, 0], // difference of the two
            dragging: false
        };

        this.pixelBounds = this.#getPixelBounds();
        this.dataBounds = this.#getDataBounds();

        this.defaultDataBounds = this.#getDataBounds();

        this.#draw();

        this.#addEventListeners();
    }

    showDynamicPoint(point, label, nearestSamples) {
        this.dynamicPoint = {point, label};
        this.nearestSamples = nearestSamples;
        this.#draw();
    }

    hideDynamicPoint() {
        this.dynamicPoint = null;
        this.#draw();
    }

    #addEventListeners() {
        const {canvas, dataTrans, dragInfo} = this;
        canvas.onmousedown = evt => {
            const dataLoc = this.#getMouse(evt, true);
            dragInfo.start = dataLoc;
            dragInfo.dragging = true;
            dragInfo.end = [0, 0];
            dragInfo.offset = [0, 0];
        };

        canvas.onmousemove = evt => {
            if (dragInfo.dragging) {
                const dataLoc = this.#getMouse(evt, true);
                dragInfo.end = dataLoc;
                dragInfo.offset = math.scale( // take scale into account as otherwise zoom level will influence drag speed
                    math.subtract(dragInfo.start, dragInfo.end),
                    dataTrans.scale ** 2
                );
                const newOffset = math.add(dataTrans.offset, dragInfo.offset);
                this.#updateDataBounds(newOffset, dataTrans.scale);
                this.#draw();
            }

            // highlight nearest point to current mouse position
            // pixel location of mouse
            const pLoc = this.#getMouse(evt);
            const pPoints = this.samples.map(s => math.remapPoint(this.dataBounds, this.pixelBounds, s.point));
            // find nearest data point to mouse locations
            const index = math.getNearest(pLoc, pPoints);
            const nearest = this.samples[index];

            const dist = math.distance(pPoints[index], pLoc);
            if (dist < this.margin / 2) {
                this.hoveredSample = nearest;
            } else {
                this.hoveredSample = null;
            }
            this.#draw();

        };

        canvas.onmouseup = evt => {
            dataTrans.offset = math.add(dataTrans.offset, dragInfo.offset);
            dragInfo.dragging = false;
        };

        canvas.onwheel = evt => {
            evt.preventDefault();
            const dir = Math.sign(evt.deltaY); // -1/+1 depending on direction
            const step = 0.02;
            dataTrans.scale += dir * step;
            // clamp scale between 0.02 and 2
            dataTrans.scale = Math.max(step, Math.min(2, dataTrans.scale));

            this.#updateDataBounds(
                dataTrans.offset,
                dataTrans.scale);

            this.#draw();
        };

        canvas.onclick = () => {

            // don't highlight when dragging
            if (!math.equals(dragInfo.offset, [0, 0])) {
                return;
            }
            if (this.hoveredSample) {
                if (this.selectedSample === this.hoveredSample) {
                    this.selectedSample = null;
                } else {
                    this.selectedSample = this.hoveredSample;

                }

            } else {
                this.selectedSample = null;
            }

            if (this.onClick) {
                this.onClick(this.selectedSample);
            }
            this.#draw();
        };
    }

    #updateDataBounds = (offset, scale) => {
        const {dataBounds, defaultDataBounds: def} = this;

        // we could just multiply all the following values with scale,
        // but then the axes scale numbers / databounds would remain the same,
        // so it would zoom in / out, but would get out of the viewport
        // and not represent the values correctuly anymore
        dataBounds.left = def.left + offset[0];
        dataBounds.right = def.right + offset[0];
        dataBounds.top = def.top + offset[1];
        dataBounds.bottom = def.bottom + offset[1];

        const center = [
            (dataBounds.left + dataBounds.right) / 2,
            (dataBounds.top + dataBounds.bottom) / 2,
        ];

        // we could use just scale, but optically this feels more natural this way
        // if using just scale, the zooming seems slower at the beginning (when it's closer to 1) than with a higher / lower scale
        const scaleSquared = scale ** 2;

        dataBounds.left = math.lerp(center[0], dataBounds.left, scaleSquared);
        dataBounds.right = math.lerp(center[0], dataBounds.right, scaleSquared);
        dataBounds.top = math.lerp(center[1], dataBounds.top, scaleSquared);
        dataBounds.bottom = math.lerp(center[1], dataBounds.bottom, scaleSquared);

    };

    #getMouse = (evt, dataSpace = false) => {
        const rect = this.canvas.getBoundingClientRect();
        const pixelLoc = [
            evt.clientX - rect.left,
            evt.clientY - rect.top
        ];
        if (dataSpace) {
            const dataLoc = math.remapPoint(this.pixelBounds, this.defaultDataBounds, pixelLoc);
            return dataLoc;
        }
        return pixelLoc;
    };

    #getPixelBounds() {
        // margin is just a padding we want to have inside the canvas so it looks nicer
        const {canvas, margin} = this;
        const bounds = {
            left: margin,
            right: canvas.width - margin,
            top: margin,
            bottom: canvas.height - margin,
        };
        return bounds;
    }

    #getDataBounds() {
        const {samples} = this;
        const x = samples.map(s => s.point[0]);
        const y = samples.map(s => s.point[1]);
        const minX = Math.min(...x);
        const maxX = Math.max(...x);
        const minY = Math.min(...y);
        const maxY = Math.max(...y);

        // "unsquish" / normalize - both axes should have the same value space, even
        // if the max value of feature 1 (X) is 200 and the other (Y) is 600
        // then, both should have a max value of 600
        // if differences are large, it might make the chart useless though as
        // the axis with the (much) lower max will be mostly empty
        const deltaX = maxX - minX;
        const deltaY = maxY - minY;
        const maxDelta = Math.max(deltaX, deltaY);


        const bounds = {
            left: minX,
            right: maxX,// minX+maxDelta, (commented out is used to unsquish if the data
            top: maxY, // minY + maxDelta,
            bottom: minY
        };
        return bounds;
    }

    #drawAxes() {
        const {ctx, canvas, axesLabels, margin} = this;
        const {left, right, top, bottom} = this.pixelBounds;

        // crop parts of data that overlaps axex
        ctx.clearRect(0, 0, canvas.width, margin);
        ctx.clearRect(0, 0, margin, canvas.height);
        ctx.clearRect(canvas.width - margin, 0, margin, canvas.height);
        ctx.clearRect(0, canvas.height - margin, canvas.width, margin);

        graphics.drawText(ctx, {
            text: axesLabels[0],
            loc: [canvas.width / 2, bottom + margin / 2],
            size: margin * .6

        });

        ctx.save();
        ctx.translate(left - margin / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        graphics.drawText(ctx, {
            text: axesLabels[1],
            loc: [0, 0], // we can use 0,0 here because we translated / rotated the canvas so that it's the right location
            size: margin * .6
        });
        ctx.restore(); // restore original canvas state before rotation / translation

        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(left, bottom);
        ctx.lineTo(right, bottom);
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
        ctx.setLineDash([]);

        const dataMin = math.remapPoint(this.pixelBounds, this.dataBounds, [left, bottom]);
        graphics.drawText(ctx, {
            text: math.formatNumber(dataMin[0]),
            loc: [left, bottom],
            size: margin * 0.3,
            align: "left",
            vAlign: "top"
        });

        ctx.save();
        ctx.translate(left, bottom);
        ctx.rotate(-Math.PI / 2);
        graphics.drawText(ctx, {
            text: math.formatNumber(dataMin[1]),
            loc: [0, 0],
            size: margin * 0.3,
            align: "left",
            vAlign: "bottom"
        });
        ctx.restore();

        const dataMax = math.remapPoint(this.pixelBounds, this.dataBounds, [right, top]);
        graphics.drawText(ctx, {
            text: math.formatNumber(dataMax[0]),
            loc: [right, bottom],
            size: margin * 0.3,
            align: "right",
            vAlign: "top"
        });

        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(-Math.PI / 2);
        graphics.drawText(ctx, {
            text: math.formatNumber(dataMax[1]),
            loc: [0, 0],
            size: margin * 0.3,
            align: "right",
            vAlign: "bottom"
        });
        ctx.restore();

    }

    #draw() {
        const {ctx, canvas} = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // new code for background (100*100 pixel decision boundary image created with run_evaluation.js)
        // upscale 100*100 image
        const topLeft = math.remapPoint(this.dataBounds, this.pixelBounds, [0, 1]);
        const sz = (canvas.width - this.margin * 2) / this.dataTrans.scale ** 2;
        ctx.drawImage(this.bg, ...topLeft, sz, sz);

        // end new code for background
        ctx.globalAlpha = this.transparency;

        // commented out so we see only the decision boundary (which has basically the same information)
        /*this.#drawSamples(this.samples);

        ctx.globalAlpha = 1;

        if (this.hoveredSample) {
            this.#emphasizeSample(this.hoveredSample);
        }

        if (this.selectedSample) {
            this.#emphasizeSample(this.selectedSample, 'yellow');
        }*/

        if (this.dynamicPoint) {
            const {point, label} = this.dynamicPoint;
            const pixelLoc = math.remapPoint(this.dataBounds, this.pixelBounds, point);
            // add "overlay" around point;
            // size has to be extremely large because we could be zoomed in


            graphics.drawPoint(ctx, pixelLoc, 'rgba(255,255,255,0.7)', 10000000);
            // commented out now that we only use the decision boundary background
            // so the nearest neighbor lines don't make visual sense anymore
            /*
            ctx.strokeStyle = "gray";
            // draw a line between point and nearest sample
            for (let ns of this.nearestSamples) {
                ctx.beginPath();
                ctx.moveTo(...pixelLoc);
                ctx.lineTo(...math.remapPoint(this.dataBounds, this.pixelBounds, ns.point));
                ctx.stroke();
            }*/
            graphics.drawImage(ctx, this.styles[label].image, pixelLoc);

        }

        this.#drawAxes();
    }

    selectSample(sample) {
        this.selectedSample = sample;
        this.#draw();
    }

    #emphasizeSample(sample, color = "white") {
        const pLoc = math.remapPoint(this.dataBounds, this.pixelBounds, sample.point);
        const grd = this.ctx.createRadialGradient(...pLoc, 0, ...pLoc, this.margin);

        grd.addColorStop(0, color);
        grd.addColorStop(1, "rgba(255,255,255,0)");
        graphics.drawPoint(this.ctx, pLoc, grd, this.margin * 2);
        this.#drawSamples([sample]);
    }

    #drawSamples(samples) {
        const {ctx, dataBounds, pixelBounds} = this;
        for (const sample of samples) {
            const {point, label} = sample;

            const pixelLoc = math.remapPoint(dataBounds, pixelBounds, point);

            switch (this.icon) {
                case 'text':
                    graphics.drawText(ctx, {text: this.styles[label].text, loc: pixelLoc, size: 20});
                    break;
                case 'image': {
                    graphics.drawImage(ctx, this.styles[label].image, pixelLoc);
                    break;
                }
                default:
                    graphics.drawPoint(ctx, pixelLoc, this.styles[label].color);
            }

        }
    }


}
