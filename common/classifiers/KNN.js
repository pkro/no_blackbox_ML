if (typeof utils === 'undefined') {
    utils = require('../utils');
}
class KNN {
    constructor(samples, k) {
        this.samples=samples;
        this.k = k;
    }

    predict(point) {
        const samplePoints = this.samples.map(s => s.point);
        const nearestIndices = utils.getNearest(point, samplePoints, this.k);
        const nearestSamples = nearestIndices.map(idx=>this.samples[idx]);
        const labels = nearestSamples.map(s => s.label);
        const counts = {};
        for (let label of labels) {
            counts[label] = counts[label] ? counts[label] + 1 : 1;
        }
        const max = Math.max(...Object.values(counts));
        const label = labels.find(l => counts[l] === max);
        return {label, nearestSamples};
    }
}

if (typeof module !== 'undefined') {
    module.exports=KNN;
}
