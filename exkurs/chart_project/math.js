const math = {};

/**
 * Linearly interpolates between two values based on a given factor.
 *
 * This function is useful for various applications such as animations,
 * color blending, and data visualization, where estimating values between
 * known points is needed.
 * example: lerp(1,10,0.5) === 5
 *
 * @param {number} startValue - The starting value of the range.
 * @param {number} endValue - The ending value of the range.
 * @param {number} interpolationFactor - A value between 0 and 1 representing the position within the range to interpolate.
 * @returns {number} The interpolated value.
 */
math.lerp = (startValue, endValue, interpolationFactor) => {
    return startValue + (endValue - startValue) * interpolationFactor;
};

// Gives more precise results with floating point values
math.lerp_fp = (startValue, endValue, interpolationFactor) => {
    return startValue * (1 - interpolationFactor) + endValue * t;
};


/**
 * Calculates the relative position of a specific value within a range.
 *
 * This function is an inverse operation to linear interpolation, hence the name 'invLerp'.
 * It's useful for normalizing data, mapping values to a new range, or finding a relative position or percentage.
 *
 * @param {number} rangeStart - The starting value of the range.
 * @param {number} rangeEnd - The ending value of the range.
 * @param {number} value - The specific value to find its relative position within the range.
 * @returns {number} The relative position of the value within the range, a number between 0 and 1
 * .
 * Here are a few examples of when you might use invLerp:
 *
 *     Normalizing Data: If you have a dataset with values ranging from, say, 100 to 1000, and you want to normalize these values to a range of 0 to 1, you could use invLerp.
 *
 *     Mapping Values: If you are developing a game and want to map the player's health (which might range from 0 to 100) to a width of a health bar on the screen (which might range from 0 to 200 pixels), you could use invLerp to find out what width the health bar should be for a given health value.
 *
 *     Finding a Relative Position or Percentage: If you want to find out what percentage along a path a certain point is, you could use invLerp. For example, if you have a path from point A to point B and a point C somewhere along that path, you could use invLerp to find out what percentage of the way from A to B the point C is.
 */

math.invLerp = (rangeStart, rangeEnd, value) => {
    return (value - rangeStart) / (rangeEnd - rangeStart);
};

// maps a value from one possible value range (domain / sample space) to another
math.remap = (initialMin, initialMax, newMin, newMax, value) => {
    const t = math.invLerp(initialMin, initialMax, value);
    return math.lerp(newMin, newMax, t);
};

math.remapPoint = (oldBounds, newBounds, point) => {
    const x = math.remap(oldBounds.left, oldBounds.right, newBounds.left, newBounds.right, point[0]);
    const y = math.remap(oldBounds.top, oldBounds.bottom, newBounds.top, newBounds.bottom, point[1]);

    return [x, y];
};

math.formatNumber = (n, dec = 0) => {
    return n.toFixed(dec);
};

math.subtract = (pointA, pointB) => {
    return [pointA[0] - pointB[0], pointA[1] - pointB[1]];
};
math.add = (pointA, pointB) => {
    return [pointA[0] + pointB[0], pointA[1] + pointB[1]];
};

math.scale = (point, scaler) => {
    return [point[0] * scaler, point[1] * scaler];
}

math.distance = (p1, p2) => {
    return Math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2);
}

math.getNearest = (loc, points) => {
    let  minDist = Number.MAX_SAFE_INTEGER;
    let nearestIndex = 0;

    for (let i = 0; i < points.length; i++) {
        const dist = math.distance(loc, points[i]);
        if(dist < minDist) {
            minDist = dist;
            nearestIndex = i;
        }
    }

    return nearestIndex;
}

math.equals = (ar1,ar2) => {
    return ar1[0] === ar2[0] && ar1[1] === ar2[1];
}

