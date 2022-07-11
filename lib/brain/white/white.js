const Lstm = require("../lstm.js");
const fs = require("fs");
const path = require("path");
module.exports.init = (lstm = new Lstm()) => {
    var texts = JSON.parse(fs.readFileSync(path.join(__dirname, "./text.json"), "utf-8"));
    var data = [];
    let nowAuthor = null;
    let nowTEXT = "";
    for (let i in texts) {
        let text = texts[i];
        let now = text.split("：");
        if (!nowAuthor) nowAuthor = now[0];
        if (nowAuthor == now[0]) {
            now.shift();
            nowTEXT += now.join("：");
        } else {
            nowTEXT = nowTEXT.slice(0, nowTEXT.length - 1);
            let str = lstm.replaceTAG(nowTEXT).trim();
            if (str.startsWith(lstm.TAG.N)) {
                str = str.slice(lstm.TAG.N.length).trim();
            }
            data.push(str);
            nowAuthor = now[0];
            now.shift();
            nowTEXT = now.join("：");
        }
    }
    if (nowTEXT != "") {
        nowTEXT = nowTEXT.slice(0, nowTEXT.length - 1).trim();
        let str = lstm.replaceTAG(nowTEXT);
        if (str.startsWith(lstm.TAG.N)) {
            str = str.slice(lstm.TAG.N.length).trim();
        }
        data.push(str);
    }
    delete texts;

    let array = [];
    for (let i = 0; i < data.length; i += 2) {
        if (data[i] && data[i + 1] && data[i].length <= 20 && data[i + 1].length <= 20) {
            array = array.concat([data[i], data[i + 1]])
        }
    }
    // console.log(array);
    delete data;


    fs.writeFileSync("./data.json", JSON.stringify(array, null, 4));

    //lstm.vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "./vectors.json"), "utf-8"));
    lstm.Encoding(lstm.getCharSet(array));

    fs.writeFileSync(path.join(__dirname, "./vectors.test.json"), JSON.stringify(lstm.vectors, null, 4));

    const dataSet = lstm.text2dataSet(array);
    console.log("資料集大小", dataSet.length);

    let len = lstm.vectors[Object.keys(lstm.vectors)[0]].length;

    console.log("creating...");
    lstm.network = new lstm.neataptic.architect.LSTM(len, len, len);

    console.log("training...");
    lstm.network.train(dataSet, {
        log: 10,
        rate: 0.000000001,
        cost: lstm.neataptic.methods.cost.CROSS_ENTROPY,
        //error: 0.05,
        clear: true,
        ratePolicy: lstm.neataptic.methods.rate.STEP(null, 80),
        iterations: 50000,
        batchSize: 80
        //momentum: 0.1,
    });
    let network_json = lstm.network.toJSON();
    fs.writeFileSync(path.join(__dirname, "./lstm.test.json"), JSON.stringify(network_json, null, 4));
    writeSentence2(dataSet);

    let test_data = [
        "我",
    ];
    test_data.forEach(text => {
        console.log("Q: " + text);
        // lstm.test(text);
        if (!lstm.vectors[text]) {
            console.log("!text");
        }
        lstm.writeSentence(text);
    });

    function writeSentence2(dataSet) {
        let outputText = [];
        let output = lstm.network.activate(dataSet[0].input);

        for (let i = 0; i <= lstm.MAX * 2; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            let character = lstm.findByVec(zeros);
            outputText.push(character);
            output = lstm.network.activate(zeros);
        }
        console.log(outputText.join(" "));
    }
}

module.exports.init2 = (lstm = new Lstm()) => {
    var texts = JSON.parse(fs.readFileSync(path.join(__dirname, "./text.json"), "utf-8"));
    var data = [];
    let nowAuthor = null;
    let nowTEXT = "";
    for (let i in texts) {
        let text = texts[i];
        let now = text.split("：");
        if (!nowAuthor) nowAuthor = now[0];
        if (nowAuthor == now[0]) {
            now.shift();
            nowTEXT += now.join("：");
        } else {
            nowTEXT = nowTEXT.slice(0, nowTEXT.length - 1).toLowerCase().trim();
            let str = lstm.replaceTAG(nowTEXT).trim();
            if (str.startsWith(lstm.TAG.N)) {
                str = str.slice(lstm.TAG.N.length).trim();
            }
            data.push(str);
            nowAuthor = now[0];
            now.shift();
            nowTEXT = now.join("：");
        }
    }
    if (nowTEXT != "") {
        nowTEXT = nowTEXT.slice(0, nowTEXT.length - 1).toLowerCase().trim();
        let str = lstm.replaceTAG(nowTEXT).trim();
        if (str.startsWith(lstm.TAG.N)) {
            str = str.slice(lstm.TAG.N.length).trim();
        }
        data.push(str);
    }
    delete texts;

    let array = [];
    for (let i = 0; i < data.length; i += 2) {
        if (data[i] && data[i + 1] && data[i].length <= 20 && data[i + 1].length <= 20) {
            array = array.concat([data[i], data[i + 1]])
        }
    }
    // console.log(array);
    delete data;


    fs.writeFileSync("./data.2.json", JSON.stringify(array, null, 4));

    //lstm.vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "./vectors.json"), "utf-8"));
    lstm.Encoding(lstm.getCharSet(array), 2.5);

    fs.writeFileSync(path.join(__dirname, "./vectors.test.2.json"), JSON.stringify(lstm.vectors, null, 4));

    const dataSet = lstm.text2dataSet(array);
    console.log("資料集大小", dataSet.length);

    let len = lstm.vectors[Object.keys(lstm.vectors)[0]].length;

    console.log("creating...");
    lstm.network = new lstm.neataptic.architect.LSTM(len, len, len);

    console.log("training...");
    lstm.network.train(dataSet, {
        log: 1,
        rate: 0.001,
        cost: lstm.neataptic.methods.cost.CROSS_ENTROPY,
        //error: 0.05,
        clear: true,
        ratePolicy: lstm.neataptic.methods.rate.STEP(null, 40),
        iterations: 80,
        batchSize: 40
        //momentum: 0.1,
    });
    let network_json = lstm.network.toJSON();
    fs.writeFileSync(path.join(__dirname, "./lstm.test.2.json"), JSON.stringify(network_json, null, 4));
    writeSentence2(dataSet);

    let test_data = [
        "我",
    ];
    test_data.forEach(text => {
        console.log("Q: " + text);
        // lstm.test(text);
        if (!lstm.vectors[text]) {
            console.log("!text");
        }
        lstm.writeSentence(text);
    });

    function writeSentence2(dataSet) {
        let outputText = [];
        let output = lstm.network.activate(dataSet[0].input);

        for (let i = 0; i <= lstm.MAX * 2; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            let character = lstm.findByVec(zeros);
            outputText.push(character);
            output = lstm.network.activate(zeros);
        }
        console.log(outputText.join(" "));
    }
}

module.exports.init3 = (lstm = new Lstm()) => {
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, "./data.2.json"), "utf-8"));

    //lstm.vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "./vectors.json"), "utf-8"));
    lstm.Encoding(lstm.getCharSet(data), 2.5);

    fs.writeFileSync(path.join(__dirname, "./vectors.test.2.json"), JSON.stringify(lstm.vectors, null, 4));

    const dataSet = lstm.text2dataSet(data);
    console.log("資料集大小", dataSet.length);

    let len = lstm.vectors[Object.keys(lstm.vectors)[0]].length;

    console.log("creating...");
    lstm.network = new lstm.neataptic.architect.NARX(len, len, len, lstm.MAX, 1);

    console.log("training...");
    lstm.network.train(dataSet, {
        log: 1,
        rate: 0.01,
        cost: lstm.neataptic.methods.cost.CROSS_ENTROPY,
        //error: 0.05,
        clear: true,
        ratePolicy: lstm.neataptic.methods.rate.STEP(null, 30),
        iterations: 300,
        batchSize: 30
        //momentum: 0.1,
    });
    let network_json = lstm.network.toJSON();
    fs.writeFileSync(path.join(__dirname, "./lstm.test.2.json"), JSON.stringify(network_json, null, 4));
    writeSentence2(dataSet);

    let test_data = [
        "我",
    ];
    test_data.forEach(text => {
        console.log("Q: " + text);
        // lstm.test(text);
        if (!lstm.vectors[text]) {
            console.log("!text");
        }
        lstm.writeSentence(text);
    });

    function writeSentence2(dataSet) {
        let outputText = [];
        let output = lstm.network.activate(dataSet[0].input);

        for (let i = 0; i <= lstm.MAX * 2; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            let character = lstm.findByVec(zeros);
            outputText.push(character);
            output = lstm.network.activate(zeros);
        }
        console.log(outputText.join(" "));
    }
}

module.exports.train = (lstm = new Lstm()) => {
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, "./data.json"), "utf-8"));

    lstm.vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "./vectors.test.json"), "utf-8"));

    const dataSet = lstm.text2dataSet(data);
    delete data;

    lstm.initNetwork("./lstm.test.json");

    console.log("training...");

    let result = lstm.network.train(dataSet, {
        log: 10,
        rate: 0.0000001,
        cost: lstm.neataptic.methods.cost.CROSS_ENTROPY,
        //error: 0.05,
        clear: true,
        ratePolicy: lstm.neataptic.methods.rate.EXP(),
        iterations: 10,
        batchSize: 444
        //momentum: 0.1,
    });

    let network_json = lstm.network.toJSON();
    fs.writeFileSync(path.join(__dirname, "./lstm.test.json"), JSON.stringify(network_json, null, 4));
    return result.error;
}

module.exports.train2 = (lstm = new Lstm()) => {
    var data = JSON.parse(fs.readFileSync(path.join(__dirname, "./data.2.json"), "utf-8"));

    lstm.vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "./vectors.test.2.json"), "utf-8"));

    const dataSet = lstm.text2dataSet(data);
    delete data;

    lstm.initNetwork("./lstm.test.2.json");

    console.log("training...");

    let result = lstm.network.train(dataSet, {
        log: 100,
        rate: 0.0001,
        cost: lstm.neataptic.methods.cost.CROSS_ENTROPY,
        //error: 0.05,
        clear: true,
        ratePolicy: lstm.neataptic.methods.rate.STEP(null, 30),
        iterations: 300,
        batchSize: 30
        //momentum: 0.1,
    });

    let network_json = lstm.network.toJSON();
    fs.writeFileSync(path.join(__dirname, "./lstm.test.2.json"), JSON.stringify(network_json, null, 4));
    return result.error;
}

module.exports.test = (lstm = new Lstm()) => {
    lstm.vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "./vectors.test.json"), "utf-8"));
    lstm.initNetwork("./lstm.test.json");
    console.log("testing...");

    let test_data = [
        "你好啊",
        "早安阿",
        "有點好笑\n有的話我截圖給你xd"
    ];
    test_data.forEach(text => {
        console.log("Q: " + text);
        lstm.test(text);
    });
}

module.exports.test2 = (lstm = new Lstm()) => {
    lstm.vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "./vectors.test.2.json"), "utf-8"));
    lstm.initNetwork("./lstm.test.2.json");
    console.log("testing...");

    let test_data = JSON.parse(fs.readFileSync(path.join(__dirname, "./data.2.json"), "utf-8"));
    test_data.forEach(text => {
        console.log("Q: " + text);
        lstm.test(text);
    });

    // writeSentence2(lstm.vectors[lstm.TAG.START]);
    function writeSentence2(dataSet) {
        let outputText = [];
        let output = lstm.network.activate(dataSet);

        for (let i = 0; i <= 959; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            let character = lstm.findByVec(zeros);
            outputText.push(character);
            output = lstm.network.activate(zeros);
        }
        console.log(outputText.join(" "));
    }
}

module.exports.start = module.exports.st = () => {
    let errors = fs.readFileSync(path.join(__dirname, "error.txt"), "utf-8").split("\n").map(e => Number(e));
    while (true) {
        if (errors.length >= 2 && Number(errors[errors.length - 1]) > Number(errors[errors.length - 1])) break;
        let error = module.exports["train"]();
        errors.push(error);
        fs.appendFileSync(path.join(__dirname, "./error.txt"), `${error}\n`);
        console.log("error -=" + (errors[errors.length - 2] - error));
    }
}

module.exports.start2 = module.exports.st2 = () => {
    let errors = fs.readFileSync(path.join(__dirname, "error.txt"), "utf-8").split("\n").map(e => Number(e));
    while (true) {
        if (errors.length >= 2 && Number(errors[errors.length - 1]) > Number(errors[errors.length - 1])) break;
        let error = module.exports["train2"]();
        errors.push(error);
        fs.appendFileSync(path.join(__dirname, "./error.txt"), `${error}\n`);
        console.log("error -=" + (errors[errors.length - 2] - error));
    }
}

(() => {
    if (!process.argv || !process.argv[2]) return;
    let cmd = process.argv[2];
    if (module.exports[cmd]) {
        console.log("excute command: " + cmd)
        module.exports[cmd]();
    }
})()

