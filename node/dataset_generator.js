const fs = require('fs');
const draw = require('../common/draw');
const constants = require('../common/constants');
const utils = require('../common/utils');
const { createCanvas } = require('canvas');

const canvas =createCanvas(400,400);
const ctx = canvas.getContext('2d');

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];

let id = 1;

fileNames.forEach((fn) => {
    const content = fs.readFileSync(constants.RAW_DIR + "/" + fn);

    const {session, student, drawings} = JSON.parse(content.toString());

    // labels = car, dog etc.
    for (let label in drawings) {
        samples.push({
            id,
            label,
            student_name: student,
            student_id: session
        });

        // data files with the drawing arrays
        const paths = drawings[label];
        fs.writeFileSync(constants.JSON_DIR + "/" + id + ".json", JSON.stringify(paths));

        generateImageFile(constants.IMG_DIR + "/" + id + ".png", paths);
        const NUM_DRAWINGS_PER_FILE = 8;
        utils.printProgress(id, fileNames.length * NUM_DRAWINGS_PER_FILE);
        id++;
    }
});

// this is the mapping file between the data files and the labels (by id = data file label)
fs.writeFileSync(constants.SAMPLES_JS, "const samples = "+JSON.stringify(samples, null, 2));

function generateImageFile(outFile, paths) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw.paths(ctx, paths);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}
