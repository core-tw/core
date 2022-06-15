const { MessageEmbed } = require("discord.js");
const {
	functions: { errorEmbed, log }
} = require("./../../lib/index.js");
const setting = require("./../../config/setting.json");

module.exports = {
  num: 23,
  name: ["播放歌單", "playlist"],
  type: "music",
  expectedArgs: "<播放清單的歌曲序列>",
  description: "播放個人歌單",
  minArgs: 0,
  maxArgs: 1,
  level: null,
  cooldown: 10,
  requireItems: [],
  requireBotPermissions: ["MANAGE_MESSAGES"],
  async execute(msg, args, client, user) {
    try {
			let { author, channel } = msg;
			let list = client.musicUsers[author.id]
			if(!list) {
				msg.reply({
          content: `你的歌單是空的喔～\n在播放的歌曲下反應\❤️以加入歌單`,
          allowedMentions: setting.allowedMentions
        });
        return;
			}
			if(args[0]) {
				let num = Number(args[0])-1;
				if(isNaN(num) || num > list.length || num < 0) {
					msg.reply({
		        content: `你的歌單只有${list.length}首喔`,
		        allowedMentions: setting.allowedMentions
		      });
					return;
				}
				let track = list[num];
				await client.music.play(msg, track.url);
				return;
			}
			list = list.map(s => s.url);
			await client.music.playlist(msg, list);
    } catch (err) {
      console.log(err);
      log(client, err.toString());
    }
  }
}