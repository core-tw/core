const fs = require("fs");
const Brain = require("./index.js");
const neataptic = require('neataptic');
const Methods = neataptic.methods;
const Config = neataptic.config;
const Architect = neataptic.architect;
const Network = neataptic.Network;
Config.warnings = false;

module.exports = class LSTM {
    constructor(options = {}) {

        this.neataptic = neataptic;

        this.brain = new Brain(null);

        this.vectors = options.vectors || null;

        this.log = options.log || false;

        this.MAX = options.MAX || 20;
        this.TAG = options.TAG || {
            START: "<START>",
            END: "<END>",
            SPACE: "<SPACE>",
            UNKNOWN: "<UNKNOWN>",
            N: "<N>",

            COMMA_1: "<COMMA>",
            COMMA_2: "<COMMA>",
            WAVE_1: "<WAVE>",
            WAVE_2: "<WAVE>",
            SURPRISE_1: "<SURPRISE>",
            SURPRISE_2: "<SURPRISE>",
            PERIOD: "<PERIOD>",
        };

        this.TO_REPLACE = options.TO_REPLACE || {
            COMMA_1: [
                "，"
            ],
            COMMA_2: [
                ","
            ],
            WAVE_1: [
                "～"
            ],
            WAVE_2: [
                "~"
            ],
            SURPRISE_1: [
                "！"
            ],
            SURPRISE_2: [
                "!"
            ],
            PERIOD: [
                "。"
            ],
            N: [
                "\n"
            ]
        };
    }

    generateAry(len, val) {
        return Array.apply(null, Array(len)).map(() => val || 0);
    }

    /**
     * 找2進位
     */
    find2(num) {
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
    initNetwork(data) {
        if (data && data === data.toString()) {
            try {
                let network_data = JSON.parse(fs.readFileSync(data));
                this.network = Network.fromJSON(network_data);
                return this.network;
            } catch (err) {
                throw err;
            }
        } else if (data) {
            try {
                this.network = Network.fromJSON(data);
                return this.network;
            } catch (err) {
                throw err;
            }
        } else if (this.vectors) {
            let len = this.vectors[Object.keys(this.vectors)[0]].length;
            console.log("creating...");
            this.network = new Architect.LSTM(len, len * 2, len * 2, len);
            return this.network;
        }
    }

    replaceTAG(text) {
        Object.keys(this.TO_REPLACE).forEach(k => {
            this.TO_REPLACE[k].forEach(v => {
                let reg = new RegExp(`${v}`, "g");
                text = text.replace(reg, ` ${this.TAG[k]} `);
            });
        });
        return text;
    }

    /**
     * 僅接受
     * [ "sentence1", "sentence2", ... ]
     */
    getCharSet(data) {
        let characters = [];
        for (let i in data) {
            let s = this.brain.convertToSegment(data[i]).segment;
            characters = characters.concat(s);
        }
        return characters.filter(function (item, i, ar) { return ar.indexOf(item) === i });
    }

    Encoding(characters, rate) {
        characters = characters.concat(Object.values(this.TAG)).filter(function (item, i, ar) { return ar.indexOf(item) === i });
        console.log("詞彙數量", characters.length);
        let vecLen = null;
        for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
            if ((2 ** i) >= characters.length) {
                vecLen = i;
                break;
            }
        }
        if (!vecLen) {
            throw new Error("錯誤：找不到合適的向量維度")
        } else {
            //vecLen += Math.floor(vecLen / 2);
            vecLen *= rate || 2;
            vecLen = Math.floor(vecLen);
            console.log("詞向量維度", vecLen);
        }
        let vec = {};
        for (let i = 0; i < characters.length; i++) {
            let t = this.find2(i);
            let zeros = this.generateAry(vecLen - t.length, 0).concat(t);
            let character = characters[i];
            vec[character] = zeros;
        }
        this.vectors = vec;
        return this.vectors;
    }

    text2dataSet(texts) {
        if (!this.vectors) throw new Error("請生成詞向量");
        let dataSet = [];
        let data = [];
        for (let i in texts) {
            let s = this.brain.convertToSegment(texts[i]).segment;
            s = s.concat(this.generateAry(this.MAX - s.length - 2, this.TAG.SPACE));
            s.push(this.TAG.END);
            data.push(this.TAG.START);
            data = data.concat(s);
        }
        // fs.writeFileSync("./data.2.json", JSON.stringify(data, null, 4));
        for (let i = 1; i < data.length; i++) {
            let previous = data[i - 1];
            let next = data[i];
            if (this.log) console.log('previous=%s next=%s onehot=%j %j', previous, next, onehot[previous], onehot[next]);
            dataSet.push({ input: this.vectors[previous] || this.vectors[this.TAG.UNKNOWN], output: this.vectors[next] || this.vectors[this.TAG.UNKNOWN] });
        }
        return dataSet;
    }

    findByVec(vec) {
        return Object.keys(this.vectors).find(key => this.vectors[key].toString() === vec.toString());
    }

    writeSentence(word) {
        if (!this.vectors) throw new Error("請生成詞向量");
        if (!this.network) throw new Error("請生成神經網路");
        if (!this.vectors[word]) throw new Error(word + "不在詞向量之中");
        let outputText = [word];
        let output = this.network.activate(this.vectors[word]);

        for (let i = 0; i <= this.MAX; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            // console.log(i, zeros);
            let character = this.findByVec(zeros);
            outputText.push(character || this.TAG.UNKNOWN);
            if (!character) {
                console.log(zeros);
            }
            output = this.network.activate(zeros);
        }
        console.log(outputText.join(" "));
        return outputText;
    }

    test(str) {
        if (!this.vectors) throw new Error("請生成詞向量");
        if (!this.network) throw new Error("請生成神經網路");
        Object.keys(this.TO_REPLACE).forEach(k => {
            this.TO_REPLACE[k].forEach(v => {
                let reg = new RegExp(`${v}`, "g");
                str = str.replace(reg, ` ${this.TAG[k]} `);
            });
        });
        let dataSet = [];
        let data = this.brain.convertToSegment(str).segment;
        data = [this.TAG.START].concat(data).concat(this.generateAry(this.MAX - data.length - 2, this.TAG.SPACE))
        data.push(this.TAG.END);
        for (let i = 1; i < data.length; i++) {
            let previous = data[i - 1];
            let next = data[i];
            // console.log('previous=%s next=%s vectors=%j %j', previous, next, this.vectors[previous], this.vectors[next]);
            dataSet.push({ input: this.vectors[previous] || this.vectors[this.TAG.UNKNOWN], output: this.vectors[next] || this.vectors[this.TAG.UNKNOWN] });
        }

        let network_data = this.network.toJSON();
        let newNetwork = Network.fromJSON(network_data);

        // 製造記憶
        newNetwork.train(dataSet, {
            log: 300,
            rate: 0.00000000000000001,
            cost: Methods.cost.CROSS_ENTROPY,
            clear: false,
            iterations: 1
        });

        /*
        newNetwork.train(dataSet, {
            log: 300,
            rate: 0.0001,
            cost: Methods.cost.CROSS_ENTROPY,
            clear: true,
            iterations: 1000,
            batchSize: dataSet.length
        });

        let outputText = [this.TAG.START];

        let output = newNetwork.activate(this.vectors[this.TAG.START]);

        for (let i = 1; i < this.MAX; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            let character = this.findByVec(zeros);
            outputText.push(character || this.TAG.UNKNOWN);
            if (character === this.TAG.END) break;
            output = newNetwork.activate(zeros);
        }
        */
        let outputText = [];
        let output = newNetwork.activate(this.vectors[this.TAG.START]);
        /*
        for (let i = 1; i < dataSet.length; i++) {
            if (output) {
                let zeros = output.map(i => i >= 0.5 ? 1 : 0);
                let character = this.findByVec(zeros);
                outputText.push(character || this.TAG.UNKNOWN);
            }
            output = newNetwork.activate(dataSet[i].input, true);
        }
        console.log(outputText);
        outputText = [];
        */

        for (let i = 1; i < this.MAX; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            let character = this.findByVec(zeros);
            outputText.push(character || this.TAG.UNKNOWN);
            if (character === this.TAG.END) break;
            output = newNetwork.activate(zeros);
        }
        console.log(outputText.join(" "));// .replace(/\<S\P\A\C\E\>/g, " ")

        return outputText;
    }


}

/*

    function generateAry(len, val) {
        return Array.apply(null, Array(len)).map(() => val || 0);
    }

    function replaceTAG(text) {
        Object.keys(TO_REPLACE).forEach(k => {
            TO_REPLACE[k].forEach(v => {
                let reg = new RegExp(`${v}`, "g");
                text = text.replace(reg, ` ${TAG[k]} `);
            });
        });
        return text;
    }

    function getCharSet(data) {
        let characters = [];
        for (let i in data) {
            let s1 = brain.convertToSegment(data[i]).segment;
            characters = characters.concat(s1);
        }
        return characters.filter(function (item, i, ar) { return ar.indexOf(item) === i });
    }

    function Encoding(characters) {
        characters = characters.concat(Object.values(TAG)).filter(function (item, i, ar) { return ar.indexOf(item) === i });
        console.log("詞彙數量", characters.length);
        let vecLen = null;
        for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
            if ((2 ** i) >= characters.length) {
                vecLen = i;
                break;
            }
        }
        if (!vecLen) {
            console.error("錯誤：找不到合適的向量維度")
        } else {
            console.log("詞向量維度", vecLen);
        }
        let vec = {};
        for (let i = 0; i < characters.length; i++) {
            let t = find2(i);
            let zeros = generateAry(vecLen - t.length, 0).concat(t);
            let character = characters[i];
            vec[character] = zeros;
        }
        return vec;
    }

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

    function text2dataSet(texts, vec) {
        let dataSet = [];
        let data = [];
        for (let i in texts) {
            let s = brain.convertToSegment(texts[i]).segment;
            s.push(TAG.END);
            data.push(TAG.START);
            data = data.concat(s);
        }

        for (let i = 1; i < data.length; i++) {
            let previous = data[i - 1];
            let next = data[i];
            // console.log('previous=%s next=%s onehot=%j %j', previous, next, onehot[previous], onehot[next]);
            dataSet.push({ input: vec[previous] || vec[TAG.UNKNOWN], output: vec[next] || vec[TAG.UNKNOWN] });
        }
        return dataSet;
    }

    function writeSentence(vec, dataSet) {
        let outputText = [];
        let output = network.activate(dataSet[0].input);
        outputText.push(findByVec(dataSet[0].input, vec));

        for (let i = 0; i <= MAX * 2; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            let character = findByVec(zeros, vec);
            outputText.push(character);
            output = network.activate(zeros);
        }
        console.log(outputText.join(" "));
    }

    function findByVec(v, vec) {
        return Object.keys(vec).find(key => vec[key].toString() === v.toString());
    }

    function test(str, vec, network) {
        Object.keys(TO_REPLACE).forEach(k => {
            TO_REPLACE[k].forEach(v => {
                let reg = new RegExp(`${v}`, "g");
                str = str.replace(reg, ` ${TAG[k]} `);
            });
        });
        let dataSet = [];
        let data = brain.convertToSegment(str).segment;
        data = [TAG.START].concat(data);
        data.push(TAG.END);
        for (let i = 1; i < data.length; i++) {
            let previous = data[i - 1];
            let next = data[i];
            dataSet.push({ input: vec[previous] || vec[TAG.UNKNOWN], output: vec[next] || vec[TAG.UNKNOWN] });
        }

        let network_data = network.toJSON();
        let newNetwork = Network.fromJSON(network_data);

        // 製造記憶
        newNetwork.train(dataSet, {
            log: 300,
            rate: 1,
            cost: Methods.cost.MSE,
            clear: true,
            iterations: 200
        });

        let outputText = [TAG.START];

        let output = newNetwork.activate(vec[TAG.START]);

        for (let i = 1; i < MAX; i++) {
            let zeros = output.map(i => i >= 0.5 ? 1 : 0);
            let character = findByVec(zeros, vec);
            outputText.push(character || TAG.UNKNOWN);
            if (character === TAG.END) break;
            output = newNetwork.activate(zeros);
        }

        console.log(outputText.join(" "));// .replace(/\<S\P\A\C\E\>/g, " ")
    }
*/