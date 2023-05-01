"use strict";
let index = 0;
const labels = ["car", "fish", "house", "tree", "bicycle", "guitar", "pencil", "clock"];
const data = {
    student: "",
    session: new Date().getTime() + Math.random().toString(),
    drawings: {}
};
const container = document.getElementById('sketchPadContainer');
const student = document.getElementById('student');
const advanceBtn = document.getElementById('advanceBtn');
const instructions = document.getElementById('instructions');
const sketchPad = new SketchPad(container);
function start() {
    if (!student.value) {
        alert("Please type your name first!");
        return;
    }
    data.student = student.value;
    student.style.display = 'none';
    container.style.visibility = "visible";
    const label = labels[index];
    instructions.innerHTML = `Please draw a ${label}`;
    advanceBtn.innerHTML = 'Next';
    advanceBtn.onclick = next;
}
function next() {
    if (sketchPad.paths.length === 0) {
        console.log('Please draw something first');
        return;
    }
    let label = labels[index];
    data.drawings[label] = sketchPad.paths;
    sketchPad.reset();
    console.log(data);
    if (index < labels.length - 1) {
        index++;
        label = labels[index];
        instructions.innerHTML = `Please draw a ${label}`;
    }
}
