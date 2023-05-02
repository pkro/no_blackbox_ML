import * as fs from 'fs';
import draw from './draw';
import { createCanvas } from 'canvas';

console.log(draw);

const constants: Record<string, string> = {};
constants.DATA_DIR = "../data";
constants.RAW_DIR = constants.DATA_DIR + "/raw";
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.DATA_DIR + "/img";
constants.SAMPLES = constants.DATASET_DIR + "/samples.json";

const canvas =createCanvas(400,400);
const ctx: any = canvas.getContext('2d');

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples: any[] = [];

let id = 1;

fileNames.forEach((fn: string) => {
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
        const paths: Array<Array<[number, number]>> = drawings[label];
        fs.writeFileSync(constants.JSON_DIR + "/" + id + ".json", JSON.stringify(paths));

        generateImageFile(constants.IMG_DIR + "/" + id + ".png", paths);

        id++;
    }
});

// this is the mapping file between the data files and the labels (by id = data file label)
fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples, null, 2));

function generateImageFile(outFile: string, paths: Array<Array<[number, number]>>): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw.paths(ctx, paths);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}
