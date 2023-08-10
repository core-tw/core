const  { NlpManager }  =  require ("node-nlp");
const Emotion = require("./index.js");
const emotion = new Emotion(null);

const manager = new NlpManager();
manager.load("./model.nlp");
let str = "我好無聊QQ";
manager.process(emotion.lang, str).then(result => {
	console.log(result);
});
