function createRow(container, studentName, samples) {
    const row = document.createElement('div');
    row.classList.add('row');
    container.appendChild(row);

    const rowLabel = document.createElement('div');
    rowLabel.innerHTML = studentName;
    rowLabel.classList.add('rowLabel');
    row.appendChild(rowLabel);

    for (let sample of samples) {
        const {id, label, student_id} = sample;
        const sampleContainer = document.createElement('div');
        sampleContainer.addEventListener('click', () => {
            handleClick(sample, false);
        });
        sampleContainer.id = "sample_" + id;
        sampleContainer.classList.add('sampleContainer');
        const sampleLabel = document.createElement('div');
        sampleLabel.innerHTML = label;
        sampleContainer.appendChild(sampleLabel);
        const img = document.createElement('img');
        img.src = constants.IMG_DIR + '/' + id + '.png';
        img.classList.add("thumb");
        if (utils.flaggedUsers.includes(student_id)) {
            img.classList.add("blur");
        }
        sampleContainer.appendChild(img);
        row.appendChild(sampleContainer);
    }
}

function handleClick(sample, scrollIntoView = true) {
    if (!sample) {
        clearEmphasize();
        return;
    }

    const el = document.getElementById('sample_' + sample.id);
    if (el) {
        if (el.classList.contains('emphasize')) {
            clearEmphasize();
            return;
        }

        clearEmphasize();
        el.classList.add('emphasize');
        if (scrollIntoView) {
            el.scrollIntoView({behavior: "auto", block: 'center'});
        }

        if (chart) {
            chart.selectSample(sample);
        }

    }
}

function clearEmphasize() {
    document.querySelectorAll('.sampleContainer').forEach(e => e.classList.remove('emphasize'));

    if (chart) {
        chart.selectSample(null);
    }
}
