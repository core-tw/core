const fs = require("fs");
const path = require("path");

(() => {
    let chatData = JSON.parse(fs.readFileSync(path.join(__dirname, "./text.json"), "utf-8"));
    // console.log(chatData)
    chatData = chatData.reverse();// JSON.stringify(chatData, null, 4)
    fs.writeFileSync(path.join(__dirname, "./text.json"), JSON.stringify(chatData, null, 4));
});

(() => {
    console.log(find2(0));
    console.log(find2(1));
    console.log(find2(2));
    console.log(find2(3));
    function find2(num) {
        // 找2進位
        let found = false;
        let ary = [];
        while (!found) {
            ary.push((num % 2));
            num = Math.floor(num / 2);
            if (num == 1) {
                ary.push(num);
                found = true;
                break;
            }
            if (num == 0) {
                found = true;
                break;
            }
        }
        if (!found) console.error("錯誤：找不到該數字的2進位表示");
        ary.reverse();
        return ary;
    }
});

(() => {
    const Lstm = require("../lstm.js");
    let lstm = new Lstm();
    lstm.initNetwork("./lstmModel.json");
    lstm.vectors = JSON.parse(fs.readFileSync(path.join(__dirname, "./vectors.json"), "utf-8"))
    let test_data = [
        "好聽的",
        "夢",
        "我",
        "硬著頭皮",
        "不確"
    ];
    test_data.forEach(text => {
        console.log("Q: " + text);
        // lstm.test(text);
        if (!lstm.vectors[text]) {
            console.log("!text");
        }
        writeSentence2(text);
    });

    function writeSentence(dataSet) {
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
    function writeSentence2(word) {
        if (!lstm.vectors[word]) return;
        let outputText = [word];
        let output = lstm.network.activate(lstm.vectors[word]);

        for (let i = 0; i <= lstm.MAX * 4; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            // console.log(i, zeros);
            let character = lstm.findByVec(zeros);
            outputText.push(character || lstm.TAG.UNKNOWN);
            if (!character) {
                console.log(zeros);
            }
            output = lstm.network.activate(zeros);
        }
        console.log(outputText.join(" "));
    }
});

const Lstm = require("../lstm.js");
let lstm = new Lstm();
((lstm) => {
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
});