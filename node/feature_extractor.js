"use strict";
const constants = require('../common/constants');
const featureFunctions = require('../common/featureFunctions');
const utils = require('../common/utils');

const fs = require('fs');

console.log('Extracting features');

const outliers = [3107];
const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));
//.filter(s=>!outliers.includes(s.id)); // remove outliers found by checking the chart (if required)


for (const sample of samples) {
    const paths = JSON.parse(fs.readFileSync(constants.JSON_DIR + '/' + sample.id + '.json'));
    const functions = featureFunctions.inUse.map(f => f.function);
    sample.point = functions.map(f => f(paths));
}



const featureNames = featureFunctions.inUse.map(f => f.name);

console.log('Generating splits');

const trainingAmount = samples.length * 0.5;

const training = [];
const testing = [];

for (let i = 0; i < samples.length; i++) {
    if (i < trainingAmount) {
        training.push(samples[i]);
    } else {
        testing.push(samples[i]);
    }
}

// remap to values between 0-1 in-place
const minMax = utils.normalizePoints(training.map(s => s.point));
utils.normalizePoints(testing.map(s => s.point), minMax);

// all features
fs.writeFileSync(constants.FEATURES,
    JSON.stringify({
        featureNames,
        samples: samples.map(s => ({point: s.point, label: s.label}))
    }, null, 2));

fs.writeFileSync(constants.FEATURES_JS,
    `const features =
    ${JSON.stringify({
        featureNames,
        samples
    }, null, 2)}
    
if(typeof(module)!==\"undefined\"){module.exports=features}`);

// training data
fs.writeFileSync(constants.TRAINING,
    JSON.stringify({
        featureNames,
        samples: training.map(s => ({point: s.point, label: s.label}))
    }, null, 2));

fs.writeFileSync(constants.TRAINING_JS,
    `const training =
    ${JSON.stringify({
        featureNames,
        samples: training
    }, null, 2)}
    
if(typeof(module)!==\"undefined\"){module.exports=training}`);

// testing data
fs.writeFileSync(constants.TESTING,
    JSON.stringify({
        featureNames,
        samples: training.map(s => ({point: s.point, label: s.label}))
    }, null, 2));

fs.writeFileSync(constants.TESTING_JS,
    `const testing =
    ${JSON.stringify({
        featureNames,
        samples: testing
    }, null, 2)}
    
if(typeof(module)!==\"undefined\"){module.exports=testing}`);

// save min and max values in own file
fs.writeFileSync(constants.MIN_MAX_JS, `const minMax=${JSON.stringify(minMax)};`);

console.log('Done');
