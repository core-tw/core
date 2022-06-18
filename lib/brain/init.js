const  { NlpManager }  =  require ("node-nlp");
const lang = "zh";
(async () => {
	const manager = new NlpManager({
		languages: [ lang ],
		nlu: {
			useNoneFeature : false
		}
	});
	const data = require("./data.js").initData;
	for(let i in data) {
		domain = data[i];
		for(let j in domain) {
			if(!domain[j]) continue;
			let intent = i + "." + j;
			let { document, answer } = domain[j];
			if(document.length != 0) {
				for(let k in document) {
					manager.addDocument(
						lang,
						document[k],
						intent
					);
				}
			}
			if(answer.length != 0) {
				for(let k in answer) {
					manager.addAnswer(
						lang,
						intent,
						answer[k]
					);
				}
			}
		}
	}
	console.log("training");
	await manager.train();
	manager.save();
})();
