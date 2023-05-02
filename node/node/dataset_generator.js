"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const draw_1 = __importDefault(require("../common/draw"));
console.log(draw_1.default);
const canvas_1 = require("canvas");
const constants = {};
constants.DATA_DIR = "../data";
constants.RAW_DIR = constants.DATA_DIR + "/raw";
constants.DATASET_DIR = constants.DATA_DIR + "/dataset";
constants.JSON_DIR = constants.DATASET_DIR + "/json";
constants.IMG_DIR = constants.DATA_DIR + "/img";
constants.SAMPLES = constants.DATASET_DIR + "/samples.json";
const canvas = (0, canvas_1.createCanvas)(400, 400);
const ctx = canvas.getContext('2d');
const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;
fileNames.forEach((fn) => {
    const content = fs.readFileSync(constants.RAW_DIR + "/" + fn);
    const { session, student, drawings } = JSON.parse(content.toString());
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
        id++;
    }
});
// this is the mapping file between the data files and the labels (by id = data file label)
fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples, null, 2));
function generateImageFile(outFile, paths) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_1.default.paths(ctx, paths);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outFile, buffer);
}
