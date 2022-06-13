const setting = require('./../../config/setting.json');
const { MessageEmbed } = require("discord.js");
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
const ytdl = require('ytdl-core');

const createEmbed = (user = null, title = null, url = null, content = null, fields = null, image = null, footer = null, thumbnail = null) => {
  let embed = new MessageEmbed()
  	.setColor(setting.embedColor.normal)
		.setTimestamp();
    //.setThumbnail(icon)
	if(user) embed.setAuthor({ name: user });
	if(title) embed.setTitle(title);
	if(url) embed.setURL(url);
	if(content) embed.setDescription(content);
  if(fields) embed.addFields(fields);
	if(image) embed.setImage(image);
	if(footer) embed.setFooter({ text: footer});
	if(thumbnail) embed.setThumbnail(thumbnail);
  return embed;
}

module.exports = class {
	constructor(client) {
		this.client = client;
		this.player = new Player(client);
		this.player.on("trackStart", (queue, track) => {
			queue.metadata.channel.send({
				embeds: [createEmbed("正在播放", track.title, track.url, null, null, track.thumbnail)]
			});
		});

		this.client.on("voiceStateUpdate", (oldState, newState) => {
			if(oldState.channelId && !newState.channelId){
				let queue = this.player.getQueue(oldState.guild.id);
				if(!queue) return;
				queue.metadata.channel.send({
					embeds: [createEmbed("離開頻道")]
				});
				this.player.deleteQueue(oldState.guild.id);
			}
		});
		
	}

	async join(msg) {
		let { channel, guild, member } = msg;
		if(!msg.member.voice.channelId) {
			msg.reply({
				content: setting.music.askChannel,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		if(
			guild.me.voice.channelId &&
			guild.me.voice.channelId != member.voice.channelId
		) {
			msg.reply({
				content: setting.music.otherChannel,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		if(
			guild.me.voice.channelId &&
			guild.me.voice.channelId == member.voice.channelId
		) {
			return true;
		}
		let res = await this.connect(msg);
		if(res) {
			return true;
		} else {
			return false;
		}
	}

	async connect(msg) {
		return new Promise(async (resovle, reject) => {
			let { channel, guild, member } = msg;
			let queue = this.player.getQueue(guild.id);
			if(!queue) {
				queue = this.player.createQueue(guild, {
					leaveOnEnd: false,
		      autoSelfDeaf: true,
		      metadata: {
		        channel: channel
					}
		    });
			}
			if(!queue.connection) {
				await queue.connect(member.voice.channel).catch((error) => {
					this.player.deleteQueue(guild.id);
					msg.reply({
						content: setting.music.errorJoin,
						allowedMentions: setting.allowedMentions
					});
					resovle(null);
				});
			}
			resovle(queue);
		});
	}

	async play(msg, song) {
		let { guild, member } = msg;

		let joined = await this.join(msg);
		if(!joined) return false;

		let queue = await this.connect(msg);
		if(!queue) return false;
		
		let res = await this.player.search(song, {
      requestedBy: member,
      searchEngine: QueryType.AUTO
    });

		if (!res || !res.tracks.length) {
			msg.reply({
				content: setting.music.errorFind,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}

		if(res.playlist) {
			queue.addTracks(res.tracks);
		} else {
			queue.addTrack(res.tracks[0]);
		}
		let track = res.tracks[0];
		let info = (await ytdl.getInfo(track.url)).videoDetails;
		let description = `**Author: ${track.author}\nUpload Date: ${info.uploadDate}**\n\n` + info.description
		msg.channel.send({
			embeds: [
				createEmbed(
					"加入隊伍",
					track.title, 
					track.url, 
					description,
					null,
					null,
					`views ${track.views}｜likes ${info.likes}｜duration ${track.duration}`,
					track.thumbnail
				)]
		});
		
		if (!queue.playing) await queue.play();
		return true;
	}
	
	async resume(msg) {
		let queue = await this.connect(msg);
		if (!queue || !queue.playing) {
			msg.reply({
				content: setting.music.noMusic,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		let resume = queue.setPaused(false);
		if(resume) {
			msg.channel.send({
				embeds: [createEmbed("恢復播放")]
			});
			return true;
		} else {
			msg.reply({
				content: setting.music.errorResume,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
  }

	async pause(msg) {
    let queue = await this.connect(msg);
		if (!queue || !queue.playing) {
			msg.reply({
				content: setting.music.noMusic,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		let paused = queue.setPaused(true);
		if(paused) {
			msg.channel.send({
				embeds: [createEmbed("暫停歌曲")]
			});
			return true;
		} else {
			msg.reply({
				content: setting.music.errorPause,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
  }
	
	async skip(msg) {
		let queue = await this.connect(msg);
		if (!queue || !queue.playing) {
			msg.reply({
				content: setting.music.noMusic,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		let success = queue.skip();
    if(success) {
			msg.channel.send({
				embeds: [createEmbed("跳過歌曲")]
			});
			return true;
		} else {
			msg.reply({
				content: setting.music.errorSkip,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
  }
	
	async queue(msg) {
		let queue = await this.connect(msg);
		if (!queue || !queue.playing) {
			msg.reply({
				content: setting.music.noMusic,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
  	let currentTrack = queue.current;
    let tracks = queue.tracks.slice(0, 10).map((m, i) => {
      return `${i + 1}. **${m.title}** ([link](${m.url}))`;
    }).join("\n");
		
		tracks += "\n\n一共 `" + (queue.tracks.length+1) + "` 首"
		
    msg.channel.send({
			embeds: [createEmbed("播放隊伍", null, null, tracks, [{ 
				name: "現正播放", value: `**${currentTrack.title}** ([link](${currentTrack.url}))`
			}], currentTrack.thumbnail)]
		});
		return true;
  }

	async loop(msg, mode) {
		let queue = await this.connect(msg);
		if (!queue || !queue.playing) {
			msg.reply({
				content: setting.music.noMusic,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		mode = QueueRepeatMode[mode]
		let emoji = (mode == QueueRepeatMode.TRACK) ? "🔂" : (mode == QueueRepeatMode.QUEUE) ? "🔁" : "▶";
		let success = queue.setRepeatMode(mode);
		if(success) {
			msg.channel.send({
				embeds: [createEmbed("切換循環模式 " + emoji)]
			});
			return true;
		} else {
			msg.reply({
				content: setting.music.errorLoop,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
	}

	async leave(msg) {
		let { channel, guild, member } = msg;
		if(
			guild.me.voice.channelId &&
			guild.me.voice.channelId == member.voice.channelId
		) {
			this.player.deleteQueue(guild.id);
			msg.channel.send({
				embeds: [createEmbed("離開頻道")]
			});
			return true;
		}
		if(!msg.member.voice.channelId) {
			msg.reply({
				content: setting.music.askChannel,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		if(
			guild.me.voice.channelId &&
			guild.me.voice.channelId != member.voice.channelId
		) {
			msg.reply({
				content: setting.music.otherChannel,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
  }

	async volume(msg, vol) {
		let queue = await this.connect(msg);
		let success = queue.setVolume(vol);
		if(success) {
			msg.channel.send({
				embeds: [createEmbed(`音量調整 ${vol}%`)]
			});
			return true;
		} else {
			msg.reply({
				content: setting.music.errorVolume,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
	}
};
