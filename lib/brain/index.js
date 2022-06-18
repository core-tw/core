const Segment = require("segment");
const chineseConv = require("chinese-conv");
const  { NlpManager }  =  require ("node-nlp");

module.exports = class {
	constructor(client) {
		this.client = client;
		
		this.sify = chineseConv.sify;
		this.tify = chineseConv.tify;
		
		this.lang = "zh";
		this.manager = this.getModel();
		
		
		this.segment = this.initSegment();
		this.segmentOptions = {
			//simple: true,
			stripPunctuation: true
		}
		this.POSTAG = {}
		for(let t in this.segment.POSTAG) {
			let p = this.segment.POSTAG[t];
			if(isNaN(p)) continue;
			this.POSTAG[p] = t;
		}
		
	}

	getModel() {
		let manager = new NlpManager();
		manager.load("./model.nlp");
		return manager;
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
		  .loadStopwordDict('stopword.txt')
		return segment;
	}
	
	convertToSegment(str) {
		let text = this.sify(str);// 轉簡體
		let result = this.segment.doSegment(
			text,
			this.segmentOptions
		);
		let Pary = {
			name: [],
			place: [],
			mechanism: [],
			url: []
		}
		result = result.map(r => {
			if(r.p) {
				let list = {
					"a_nr": "name",
					"a_ns": "place",
					"a_nt": "mechanism",
					"url": "url"
				}
				if(list[this.POSTAG[r.p]]) {
					Pary[list[this.POSTAG[r.p]]].push(
						this.tify(r.w)
					);
				}
			}
			return this.tify(r.w);
		});
		return { segment: result, data: Pary}
	}
}