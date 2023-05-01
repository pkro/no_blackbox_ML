"use strict";
let index = 0;
//const labels = ["car", "fish", "house", "tree", "bicycle", "guitar", "pencil", "clock"];
const labels = ["car", "fish"];
const data = {
    student: "",
    session: new Date().getTime() + Math.random().toString(),
    drawings: {}
};
const contentContainer = document.getElementById('content');
const sketchPadContainer = document.getElementById('sketchPadContainer');
const student = document.getElementById('student');
const advanceBtn = document.getElementById('advanceBtn');
const instructions = document.getElementById('instructions');
const sketchPad = new SketchPad(sketchPadContainer);
function start() {
    if (!student.value) {
        alert("Please type your name first!");
        return;
    }
    data.student = student.value;
    student.style.display = 'none';
    sketchPadContainer.style.visibility = "visible";
    const label = labels[index];
    instructions.innerHTML = `Please draw a ${label}`;
    advanceBtn.innerHTML = 'Next';
    advanceBtn.onclick = next;
}
function save() {
    advanceBtn.style.display = "none";
    instructions.innerHTML = "Take your downloaded file and place it alongside the others";
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`);
    const fileName = `${data.session}.json`;
    element.setAttribute('download', fileName);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function next() {
    if (sketchPad.paths.length === 0) {
        console.log('Please draw something first');
        return;
    }
    let label = labels[index];
    data.drawings[label] = sketchPad.paths;
    sketchPad.reset();
    if (index < labels.length - 1) {
        index++;
        label = labels[index];
        instructions.innerHTML = `Please draw a ${label}`;
    }
    else {
        sketchPadContainer.style.display = "none";
        instructions.innerHTML = "Thank you!";
        advanceBtn.innerHTML = "SAVE";
        advanceBtn.onclick = save;
    }
}
