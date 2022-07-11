const Segment = require("segment");
const chineseConv = require("chinese-conv");
const { NlpManager } = require("node-nlp");
const Network = require('neataptic').Network;
const fs = require("fs");
const path = require("path");

module.exports = class Brain {
    constructor(client) {
        this.client = client;

        this.memory = [];
        this.database = {};

        // 繁簡轉換
        this.sify = chineseConv.sify;
        this.tify = chineseConv.tify;

        // 分詞模組
        this.segment = this.initSegment();
        this.segmentOptions = {
            //simple: true,
            stripPunctuation: true
        }
        this.POSTAG = {};
        for (let t in this.segment.POSTAG) {
            let p = this.segment.POSTAG[t];
            if (isNaN(p)) continue;
            this.POSTAG[p] = t;
        }

    }

    init() {
        // 情緒識別模組
        this.lang = "zh";
        this.manager = this.getNlpModel();

        // 回應生成 LSTM模型
        this.network = this.getLstmModel();
    }

    initSegment() {
        let segment = new Segment()
            .use("URLTokenizer")
            .use("DictTokenizer")
            .use("ChsNameTokenizer")
            .use("EmailOptimizer")
            .use("ChsNameOptimizer")
            .use("DictOptimizer")
            .use("DatetimeOptimizer")
            .loadDict('dict.txt')
            .loadDict('dict2.txt')
            .loadDict('names.txt')
            .loadDict('wildcard.txt', 'WILDCARD', true)
            .loadSynonymDict('synonym.txt')
            .loadStopwordDict('stopword.txt');
        return segment;
    }

    getNlpModel() {
        let manager = new NlpManager();
        manager.load("./model.nlp");
        return manager;
    }

    getLstmModel() {
        let network_data = JSON.parse(fs.readFileSync(path.join(__dirname, "./lstmModel.json")));
        let newNetwork = Network.fromJSON(network_data);
        return newNetwork;
    }

    convertToSegment(str) {
        let result = this.segment.doSegment(
            this.sify(str),
            this.segmentOptions
        );
        let Pary = {
            name: [],
            place: [],
            mechanism: [],
            url: []
        }
        result = result.map(r => {
            str.trim();
            let a = str;
            str = a.slice(r.w.length).trim();
            a = a.slice(0, r.w.length).trim();
            if (r.p) {
                let list = {
                    "a_nr": "name",
                    "a_ns": "place",
                    "a_nt": "mechanism",
                    "url": "url"
                }
                if (list[this.POSTAG[r.p]]) {
                    Pary[list[this.POSTAG[r.p]]].push(a);
                }
            }
            return a;
        });
        return { segment: result, data: Pary }
    }

    /*
    newMemory(sentence, emotion, data) {
        this.memory.push({
            sentence: sentence,
            emotion: emotion,
            data: data
        });
    }
    
    async record(q, a) {
        let result = await this.manager.process(this.lang, q)
        let { intent } = result;
        console.log(intent);
        if (intent == "None") return;
        if (!this.database[intent.split(".")[0]]) {
            this.database[intent.split(".")[0]] = {}
        }
        if (!this.database[intent.split(".")[0]][intent.split(".")[1]]) {
            this.database[intent.split(".")[0]][intent.split(".")[1]] = [];
        }
        this.database[intent.split(".")[0]][intent.split(".")[1]].push([q, a]);
    }
    */
}