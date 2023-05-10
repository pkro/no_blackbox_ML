"use strict"
const constants = require('../common/constants');
const features = require('../common/features');

const fs = require('fs');

console.log('Extracting features');
const samples = JSON.parse(fs.readFileSync(constants.SAMPLES));

const samplesJson = [];
for (const sample of samples) {
    const paths = JSON.parse(fs.readFileSync(constants.JSON_DIR + '/' + sample.id + '.json'));
    const point = [features.getPathCount(paths), features.getPointCount(paths)];
    sample.point = point;
    samplesJson.push({point: point, label: sample.label});

}

const featureNames = ['Path count', 'Point count'];

fs.writeFileSync(constants.FEATURES,
    JSON.stringify({
        featureNames,
        samples: samplesJson
    }, null, 2));

fs.writeFileSync(constants.FEATURES_JS,
    `const features =
    ${JSON.stringify({
        featureNames,
        samples
    }, null, 2)}
    
if(typeof(module)!==\"undefined\"){module.exports=features}`);

console.log('Done');
