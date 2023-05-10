const features = {};

features.getPathCount = paths=> paths.length;

features.getPointCount = paths => paths.flat().length;

if (typeof module !== 'undefined') {
    module.exports = features;
}
