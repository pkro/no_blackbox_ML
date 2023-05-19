const utils = {};

utils.flaggedUsers=
    [1663882102141,1663900040545,1664485938220];

utils.styles = {
    car:{color:'gray',text:'🚗'},
    fish:{color:'red',text:'🐠'},
    house:{color:'yellow',text:'🏠'},
    tree:{color:'green',text:'🌳'},
    bicycle:{color:'cyan',text:'🚲'},
    guitar:{color:'blue',text:'🎸'},
    pencil:{color:'magenta',text:'✏️'},
    clock:{color:'lightgray',text:'🕒'},

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
