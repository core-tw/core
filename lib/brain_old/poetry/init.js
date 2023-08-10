const neataptic = require('neataptic');
const Methods = neataptic.methods;
const Config = neataptic.config;
const Architect = neataptic.architect;
const Network = neataptic.Network;

const fs = require("fs");
const path = require("path");

const MAX = 50;

const TAG = {
    START: "<START>",
    END: "<END>",
    N: "<N>",
    SPACE: "<SPACE>",
    UNKNOWN: "<UNKNOWN>"
};

(() => {
    var data = fs.readFileSync("./data.txt", "utf-8").split("\n");
    var dataset = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].split(" ").length == 3) {
            dataset = dataset.concat([TAG.END, TAG.START]);
        } else {
            let ary = data[i].split("");
            ary.push(TAG.N);
            dataset = dataset.concat(ary);
        }
    }
    dataset.shift();
    const characters = getCharSet(dataset);

    const len = characters.length + Object.keys(TAG).length;

    const onehot = oneHotEncoding(characters);

    const dataSet = text2dataSet(dataset, onehot);

    delete dataset;

    console.log("creating...")
    const network = new Architect.LSTM(len, len * 2, len);
    console.log("training...")
    network.train(dataSet, {
        log: 1,
        rate: 0.3,
        cost: Methods.cost.MSE,
        error: 0.0005,
        clear: true
    });

    writeSentence(onehot, dataSet);
    test(onehot, network);
    let network_json = network.toJSON();
    fs.writeFileSync(path.join(__dirname, "./lstmModel.json"), JSON.stringify(network_json, null, 1));

    function generateAry(len, val) {
        return Array.apply(null, Array(len)).map(() => val || 0);
    }

    function getCharSet(dataset) {
        return dataset.filter(function (item, i, ar) { return ar.indexOf(item) === i });
    }

    function oneHotEncoding(characters) {
        let onehot = {};
        for (let i = 0; i < characters.length; i++) {
            let zeros = generateAry(characters.length);
            zeros[i] = 1;
            let character = characters[i];
            onehot[character] = zeros;
        }
        return onehot;
    }

    function text2dataSet(data, onehot) {
        let dataSet = [];
        console.log("共有 " + data.length + "筆資料要處理")
        for (let i = 1; i < data.length; i++) {
            if (i % 1000 == 0) console.log("進度 ", i);
            let previous = data[i - 1];
            let next = data[i];
            // console.log('previous=%s next=%s onehot=%j %j', previous, next, onehot[previous], onehot[next]);
            dataSet.push({ input: onehot[previous], output: onehot[next] });
        }
        return dataSet;
    }

    function writeSentence(onehot, dataSet) {
        let outputText = [];
        let output = network.activate(dataSet[0].input);
        outputText.push(findByOnehot(dataSet[0].input, onehot));

        for (let i = 0; i < MAX; i++) {
            let max = Math.max.apply(null, output);
            let index = output.indexOf(max);
            let zeros = generateAry(len);
            zeros[index] = 1;

            let character = findByOnehot(zeros, onehot);
            outputText.push(character);
            output = network.activate(zeros);
        }
        console.log(outputText.join(""));
    }

    function findByOnehot(vec, onehot) {
        return Object.keys(onehot).find(key => onehot[key].toString() === vec.toString());
    }

    function test(onehot, network) {

        let outputText = [TAG.START];
        let output = network.activate(onehot[TAG.START]);
        outputText.push(findByOnehot(output, onehot));

        for (let i = 1; i < MAX; i++) {
            let max = Math.max.apply(null, output);
            let index = output.indexOf(max);
            let zeros = generateAry(len);
            zeros[index] = 1;

            let character = findByOnehot(zeros, onehot);
            if (character == TAG.END) break;
            outputText.push(character || TAG.UNKNOWN);
            if (character === TAG.END) break;
            output = network.activate(zeros);
        }

        console.log(outputText.join(""));// .replace(/\<S\P\A\C\E\>/g, " ")
    }
})();