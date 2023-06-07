const featureFunctions = {};

featureFunctions.getPathCount = paths=> paths.length;

featureFunctions.getPointCount = paths => paths.flat().length;

featureFunctions.getWidth = paths => {
    const x = paths.flat().map(p=>p[0]);
    return Math.max(...x) - Math.min(...x);
}

featureFunctions.getHeight = paths => {
    const y = paths.flat().map(p=>p[1]);
    return Math.max(...y) - Math.min(...y);
}

featureFunctions.getRotatedHeight = paths => {
    const upperLeft = math.getNearest([0, 0], paths.flat());
    const lowerRight = math.getNearest([1000000, 1000000], paths.flat());
    return Math.abs(lowerRight - upperLeft);
}

featureFunctions.getRotatedWidth = paths => {
    const upperLeft = math.getNearest([0, 0], paths.flat());
    const lowerRight = math.getNearest([1000000, 1000000], paths.flat());
    return Math.abs(lowerRight - upperLeft);
}

// here we select which functions should be used to calculate the features
featureFunctions.inUse = [
    {name: 'Width', function: featureFunctions.getWidth},
    {name: 'Height', function: featureFunctions.getHeight},
]

/*featureFunctions.inUse = [
    {name: 'pathcount', function: featureFunctions.getPathCount},
    {name: 'pointcount', function: featureFunctions.getPointCount},
]*/

if (typeof module !== 'undefined') {
    module.exports = featureFunctions;
}
