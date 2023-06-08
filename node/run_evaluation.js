const constants = require('../common/constants');
const utils = require('../common/utils');

const KNN = require('../common/classifiers/KNN');

const fs = require('fs');

console.log('Running classification');

const {samples: trainingSamples} = JSON.parse(fs.readFileSync(constants.TRAINING));

const k = 50;
const kNN = new KNN(trainingSamples, k);

const {samples: testingSamples} = JSON.parse(fs.readFileSync(constants.TESTING));

let totalCount = 0;
let correctCount = 0;
for (const sample of testingSamples) {
    const {label: predictedLabel} = kNN.predict(sample.point);
    correctCount += predictedLabel === sample.label;
    totalCount++;
}

console.log(`ACCURACY: ${correctCount} / ${totalCount} (${utils.formatPercent(correctCount / totalCount)})`);

console.log("generating decision boundary for k = "+k+"...");

const {createCanvas} = require('canvas');

// we use 100*100 just because larger images take a long time to generate
const canvas = createCanvas(100, 100);
const ctx = canvas.getContext('2d');

// treat each pixel as a data point to create a colored decision boundary
for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
        // divide coords by width/height to normalize between 0 and 1
        const point = [
            x / canvas.width,
            1 - y / canvas.height // subtract from 1 because in the chart it should go from the button upwards, not down like in normal pixel coords
        ];
        const {label} = kNN.predict(point);
        const color = utils.styles[label].color;
        ctx.fillStyle=color;
        // color that one pixel
        ctx.fillRect(x,y,1,1);
    }
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);

