/**
 * 成功案例
 */
const Brain = require("../index");
const brain = new Brain(null);

const neataptic = require('neataptic');
const Methods = neataptic.methods;
const Config = neataptic.config;
const Architect = neataptic.architect;
const Network = neataptic.Network;
Config.warnings = false;

const fs = require("fs");
const path = require("path");
const { SlotManager } = require("node-nlp");

const MAX = 10;

const TAG = {
    START: "<START>",
    START_A: "<START_A>",
    END: "<END>",
    END_A: "<END_A>",
    SPACE: "<SPACE>",
    UNKNOWN: "<UNKNOWN>",

    COMMA: "<COMMA>",
    WAVE: "<WAVE>",
    SURPRISE: "<SURPRISE>",
    PERIOD: "<PERIOD>",
};

const TO_REPLACE = {
    COMMA: [
        "，",
        ","
    ],
    WAVE: [
        "～",
        "~"
    ],
    SURPRISE: [
        "！",
        "!"
    ],
    PERIOD: [
        "。"
    ]
};
(() => {
    var texts = [
        [
            "早安啊！",
            "恩，早安。"
        ],
        [
            "午安啊～",
            "午安。"
        ],
        [
            "晚安啊。",
            "晚安。"
        ]
    ];

    texts = replaceTAG(texts);

    const characters = getCharSet(texts);

    const len = characters.length + (Object.keys(TAG).length - Object.keys(TO_REPLACE).length);

    const onehot = oneHotEncoding(characters);

    const dataSet = text2dataSet(texts, onehot);
    const network = new Architect.NARX(len, len, len, 20, 20);

    network.train(dataSet, {
        log: 100,
        rate: 0.03,
        cost: Methods.cost.MSE,
        error: 0.00005,
        clear: true,
        //iterations: 600
    });



    let test_data = [
        "早安啊！",
        "午安啊。",
        "晚安啊！",
        "早安",
        "午安",
        "晚安",
        "我是誰？"
    ];
    test_data.forEach(text => {
        console.log("Q: " + text);
        test(text, onehot, network);
    });

    let network_json = network.toJSON();
    fs.writeFileSync(path.join(__dirname, "./lstmModel.json"), JSON.stringify(network_json, null, 4));
    writeSentence(onehot, dataSet);
    function generateAry(len, val) {
        return Array.apply(null, Array(len)).map(() => val || 0);
    }

    function replaceTAG(texts) {
        return texts.map(text => {
            return text.map(str => {
                Object.keys(TO_REPLACE).forEach(k => {
                    TO_REPLACE[k].forEach(v => {
                        let reg = new RegExp(`${v}`, "g");
                        str = str.replace(reg, ` ${TAG[k]} `);
                    });
                });
                return str;
            });
        })
    }

    function getCharSet(texts) {
        let characters = [];
        for (let i in texts) {
            let s1 = brain.convertToSegment(texts[i][0]).segment;
            let s2 = brain.convertToSegment(texts[i][1]).segment;
            characters = characters.concat(s1).concat(s2);
        }
        return characters.filter(function (item, i, ar) { return ar.indexOf(item) === i });
    }

    function oneHotEncoding(characters) {
        characters = characters.concat(Object.values(TAG)).filter(function (item, i, ar) { return ar.indexOf(item) === i });
        let onehot = {};
        for (let i = 0; i < characters.length; i++) {
            let zeros = generateAry(characters.length);
            zeros[i] = 1;
            let character = characters[i];
            onehot[character] = zeros;
        }
        return onehot;
    }

    function text2dataSet(texts, onehot) {
        let dataSet = [];
        let data = [];
        texts.map(text => {
            let s1 = brain.convertToSegment(text[0]).segment;
            let s2 = brain.convertToSegment(text[1]).segment;
            //data = data.concat([TAG.START].concat(s1).concat([TAG.END, TAG.START_A]).concat(s2).concat([TAG.END_A]));
            let ary1 = [TAG.START].concat(s1).concat(generateAry(MAX - s1.length - 1, TAG.SPACE));
            let ary2 = [TAG.END, TAG.START_A].concat(s2).concat(generateAry(MAX - s2.length - 1, TAG.SPACE));
            data = data.concat(ary1).concat(ary2).concat([TAG.END_A]);
        });
        console.log(data)
        for (let i = 1; i < data.length; i++) {
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

        for (let i = 0; i <= MAX * 6; i++) {
            let max = Math.max.apply(null, output);
            let index = output.indexOf(max);
            let zeros = generateAry(len);
            zeros[index] = 1;

            let character = findByOnehot(zeros, onehot);
            outputText.push(character);
            output = network.activate(zeros);
        }
        console.log(outputText.join(" "));
    }

    function findByOnehot(vec, onehot) {
        return Object.keys(onehot).find(key => onehot[key].toString() === vec.toString());
    }

    function test(str, onehot, network) {
        Object.keys(TO_REPLACE).forEach(k => {
            TO_REPLACE[k].forEach(v => {
                let reg = new RegExp(`${v}`, "g");
                str = str.replace(reg, ` ${TAG[k]} `);
            });
        });
        let dataSet = [];
        let data = brain.convertToSegment(str).segment;
        data = [TAG.START].concat(data);
        data = data.concat(generateAry(MAX - 1 - data.length, TAG.SPACE)).concat([TAG.END]);
        data.push(TAG.END);
        console.log(data);
        for (let i = 1; i < data.length; i++) {
            let previous = data[i - 1];
            let next = data[i];
            dataSet.push({ input: onehot[previous] || onehot[TAG.UNKNOWN], output: onehot[next] || onehot[TAG.UNKNOWN] });
        }

        let network_data = network.toJSON();
        let newNetwork = Network.fromJSON(network_data);


        // 製造記憶
        newNetwork.train(dataSet, {
            log: 300,
            rate: 0.00000000000000001,
            cost: Methods.cost.MSE,
            clear: false,
            iterations: 1
        });


        let outputText = []//TAG.START_A];

        //let output = newNetwork.activate(onehot[TAG.START_A]);
        let output = null;
        // newNetwork.clear();
        /*
        for (let i in dataSet.length) {
            //if (output) {
            //    let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            //    let character = this.findByVec(zeros);
            //    outputText.push(character || this.TAG.UNKNOWN);
            //}
            newNetwork.activate(dataSet[i].input);
        }*/
        output = newNetwork.activate(onehot[TAG.START_A]);
        for (let i = 1; i < MAX; i++) {
            let max = Math.max.apply(null, output);
            let index = output.indexOf(max);
            let zeros = generateAry(len);
            zeros[index] = 1;

            let character = findByOnehot(zeros, onehot);
            // if (character == TAG.END || character == TAG.END_A) break;
            outputText.push(character || TAG.UNKNOWN);
            if (character === TAG.END_A) break;
            output = newNetwork.activate(zeros);
        }

        console.log(outputText.join(" "));// .replace(/\<S\P\A\C\E\>/g, " ")
    }
})();