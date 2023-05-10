const utils = {};

utils.flaggedUsers=
    [1663882102141,1663900040545,1664485938220];

utils.styles = {
    car: 'gray',
    fish: 'red',
    house: 'yellow',
    tree: 'green',
    bicycle: 'cyan',
    guitar: 'blue',
    pencil: 'magenta',
    clock: 'lightgray'

}

utils.formatPercent = (n) => `${(n*100).toFixed(2)}%`;

utils.printProgress = (count, max)=>{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const percent = utils.formatPercent(count / max);
    process.stdout.write(count + "/" + max + " (" + percent + ")");
}

utils.groupBy = (objArr, key) => {
    return objArr.reduce((acc, current) => {
        if (!acc.hasOwnProperty(current[key])) {
            return {...acc, [current[key]]: [current]}
        }
        return {...acc, [current[key]]: [...acc[current[key]], current]};
    }, {});
}



if (typeof module !== 'undefined') {
    module.exports = utils;
}
