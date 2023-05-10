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
math.lerp = (startValue,endValue,interpolationFactor) => {
    return startValue + (endValue - startValue) * interpolationFactor;
}

// Gives more precise results with floating point values
math.lerp_fp = (startValue,endValue,interpolationFactor) => {
    return startValue * (1-interpolationFactor) + endValue * t;
}
