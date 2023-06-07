const utils = {};

utils.flaggedUsers =
    [1663882102141, 1663900040545, 1664485938220];

utils.styles = {
    car: {color: 'gray', text: '🚗'},
    fish: {color: 'red', text: '🐠'},
    house: {color: 'yellow', text: '🏠'},
    tree: {color: 'green', text: '🌳'},
    bicycle: {color: 'cyan', text: '🚲'},
    guitar: {color: 'blue', text: '🎸'},
    pencil: {color: 'magenta', text: '✏️'},
    clock: {color: 'lightgray', text: '🕒'},

};

utils.formatPercent = (n) => `${(n * 100).toFixed(2)}%`;

utils.printProgress = (count, max) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const percent = utils.formatPercent(count / max);
    process.stdout.write(count + "/" + max + " (" + percent + ")");
};

utils.groupBy = (objArr, key) => {
    return objArr.reduce((acc, current) => {
        if (!acc.hasOwnProperty(current[key])) {
            return {...acc, [current[key]]: [current]};
        }
        return {...acc, [current[key]]: [...acc[current[key]], current]};
    }, {});
};

utils.distance = (p1, p2) => {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
};

utils.getNearest = (loc, points, k = 1) => {

    const obj = points.map((val, idx) => {
        return {idx: idx, val};
    });

    // sort so the nearest ones are first
    const sorted = obj.sort((a, b) => utils.distance(loc, a.val) - utils.distance(loc, b.val));

    // return the closest k indices
    const indices = sorted.slice(0,k).map(obj=>obj.idx);
    return indices;

};

utils.getMajority = (indices) => {
    const items = new Map(Array.from(new Set(indices).map(e => [e, 0])));
    console.log(items);
    for (let item of items.keys()) {
        const count = indices.unique;
    }
};

utils.invLerp = (rangeStart, rangeEnd, value) => {
    return (value - rangeStart) / (rangeEnd - rangeStart);
};

utils.normalizePoints = (points, minMax = undefined) => {
    const dimensions = points[0].length;
    let min, max;

    if (minMax) {
        min = minMax.min;
        max = minMax.max;
    } else {
        // allow for multiple dimensions

        min = [...points[0]];
        max = [...points[0]];

        for (let i = 1; i < points.length; i++) {
            for (let j = 0; j < dimensions; j++) {
                min[j] = Math.min(min[j], points[i][j]);
                max[j] = Math.max(max[j], points[i][j]);
            }
        }
    }


    // change the values in-place (not great but hey, free course)
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < dimensions; j++) {
            points[i][j] = utils.invLerp(min[j], max[j], points[i][j]);
        }
    }

    // ... and return the min / max values to use to normalize the input in the drawing
    // in viewer.html
    return {min, max};
};

if (typeof module !== 'undefined') {
    module.exports = utils;
}

