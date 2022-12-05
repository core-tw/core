const {
    functions: { log },
	chRecorder
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
    num: 28,
    name: ["串流", "webcam", "wc"],
    type: "admin",
    expectedArgs: "",
    description: "將網頁串流錄製成檔案",
    minArgs: 0,
    maxArgs: 0,
    level: null,
    cooldown: 60,
    requireItems: [],
    requireBotPermissions: [],
    async execute(msg, args, client, user) {
    	const channelId = msg.channel.id;

		const createEmbed = (text) => {
		    let embed = new MessageEmbed()
		        .setTitle("Recording..")
		        .setColor(setting.embedColor.normal)
				.setDescription(text)
		        .setFooter({ text: "core.webcam..." })
		        .setTimestamp();
		        
		    return embed;
		}

		msg.channel.send({
			embeds: [createEmbed(
				`webcan url: https://core.coretw.repl.co?fname=${new Date()}&`
			)]
		});
    }
}