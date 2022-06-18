const { MessageEmbed } = require("discord.js");
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
const playdl = require("play-dl");
const log = require("./../functions/log.js");
const setting = require("./../../config/setting.json");

const createEmbed = (user = null, title = null, url = null, content = null, fields = null, image = null, footer = null, thumbnail = null) => {
  let embed = new MessageEmbed()
  	.setColor(setting.embedColor.normal)
		.setTimestamp();
	if(user) embed.setAuthor({ name: user });
	if(title) embed.setTitle(title);
	if(url) embed.setURL(url);
	if(content) embed.setDescription(content);
  if(fields) {
		fields.map(f => {
      embed.addField(f.name, (f.value).toString(), f.inline||true)
    });
	}
	if(image) embed.setImage(image);
	if(footer) embed.setFooter({ text: footer});
	if(thumbnail) embed.setThumbnail(thumbnail);
  return embed;
}

module.exports = class {
	constructor(client) {
		this.client = client;
		this.player = new Player(client, {
	    ytdlOptions: {
	      requestOptions: {
	        headers: {
	          cookie: process.env.YOUTUBE_COOKIE
	        }
	      }
	    }
		});
		
		this.player.on("trackStart", async (queue, track) => {
			let m = await queue.metadata.channel.send({
				embeds: [createEmbed(
					"正在播放", 
					track.title, 
					track.url, 
					null, 
					null, 
					track.thumbnail,
					`Voice Latency < UDP: ${queue.connection.voiceConnection.ping.udp ?? "N/A"} ms｜WebSocket: ${queue.connection.voiceConnection.ping.ws ?? "N/A"} ms >`
				)]
			});
			if(
				this.client.musicUsers[track.authorId] &&
				this.client.musicUsers[track.authorId].find(s => s.url == track.url)
			) {
				await m.react("⭐");
			}
			
			await m.react("❤️");
			
			const filter = async (reaction, user) => {
				if(user.id == this.client.user.id) return;
	      if (reaction.emoji.name == "❤️") {
					if(
						this.client.musicUsers[user.id] &&
						this.client.musicUsers[user.id].find(s => s.url == track.url)
					) {
						m.reply({
							content: `<@${user.id}> 你已經標記過這首了喔！`,
							allowedMentions: setting.allowedMentions
						});
						return;
					}
					if(!this.client.musicUsers[user.id]) {
						this.client.musicUsers[user.id] = [];
					}
					if(!track.searched) {
						let info = (await playdl.video_basic_info(track.url)).video_details;
						track.thumbnail = info.thumbnails[info.thumbnails.length-1].url
						track.description = `**Author: ${track.author}\nUpload Date: ${info.uploadedAt}**\n\n` + info.description
						track.views = info.views;
						track.likes = info.likes;
						track.duration = info.durationRaw;
					}
					this.client.musicUsers[user.id].push({
						title: track.title,
						url: track.url,
						thumbnail: track.thumbnail,
						description: track.description,
						views: track.views,
						likes: track.likes,
						duration: track.duration,
						timeStamp: Date.now().toLocaleString("en", {timeZone: "Asia/Taipei"})
					});
					await this.client.db.set("musicUsers", this.client.musicUsers);
					m.reply({
						content: `<@${user.id}> ` + setting.music.star,
						allowedMentions: setting.allowedMentions
					});
					return true;
				}
			}

			m.awaitReactions({
        filter: filter,
        max: 999,
        time: 300000,
        errors: ["time"]
      }).catch(err => {});
		});

		this.player.on("error", (queue, error) => {
			if (queue.destroyed) return;
			log(client, error);
			console.log(error)
			queue.metadata.channel.send({
				embeds: [createEmbed("離開頻道")]
			});
			this.player.deleteQueue(queue.guild.id);
		});

		this.player.on("connectionError", (queue, error) => {
			if (queue.destroyed) return;
			log(client, error);
			console.log(error)
			queue.metadata.channel.send({
				embeds: [createEmbed("離開頻道")]
			});
			this.player.deleteQueue(queue.guild.id);
		});

		this.client.on("voiceStateUpdate", (oldState, newState) => {
			if(oldState.member.id != client.user.id) return;
			if(oldState.channelId && !newState.channelId){
				let queue = this.player.getQueue(oldState.guild.id);
				if(!queue) return;
				if(queue.destroyed) return;
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
					},
					async onBeforeCreateStream(track, source, _queue) {
		        if (source === "youtube") {
		          return (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
		        }
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
					log(client, error)
					resovle(null);
				});
				if(member.voice.channel.type == "GUILD_STAGE_VOICE") {
					await guild.me.voice.setSuppressed(false);
				}
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
			let duration = 0;
			for(let i in res.tracks) {
				res.tracks[i].authorId = msg.author.id;
				let time = res.tracks[i].duration.split(":");
				duration += Number(time[0]) * 60 + Number(time[1]);
			}
			msg.channel.send({
				embeds: [
					createEmbed(
						"已將歌單加入隊伍",
						res.playlist.title, 
						res.playlist.url, 
						res.playlist.description,
						null,
						null,
						`Tracks ${res.playlist.tracks.length}｜duration ${duration}`,
						res.playlist.thumbnail
					)]
			});
			
			queue.addTracks(res.tracks);
		} else {
			let track = res.tracks[0];
			let needSearch = true;
			if(this.client.musicUsers[msg.author.id]) {
				let t = this.client.musicUsers[msg.author.id].find(s => s.url == track.url);
				if(t) {
					track.title = t.title;
					track.url = t.url;
					track.thumbnail = t.thumbnail;
					track.description = t.description;
					track.views = t.views;
					track.likes = t.likes;
					track.duration = t.duration;
					track.authorId = t.authorId;
					needSearch = false;
				}
			}
			if(needSearch) {
				let info = (await playdl.video_basic_info(track.url)).video_details;
				track.thumbnail = info.thumbnails[info.thumbnails.length-1].url
				track.description = `**Author: ${track.author}\nUpload Date: ${info.uploadedAt}**\n\n` + info.description
				track.views = info.views;
				track.likes = info.likes;
				track.duration = info.durationRaw;
				track.authorId = msg.author.id;
				track.searched = true;
			}

			msg.channel.send({
				embeds: [
					createEmbed(
						"加入隊伍",
						track.title, 
						track.url, 
						`**Author: ${track.author}\nUpload Date: ${track.duration}**\n\n`,
						null,
						null,
						`views ${track.views}｜likes ${track.likes}｜duration ${track.duration}`,
						track.thumbnail
					)]
			});
			
			queue.addTrack(track);
		}
		if (!queue.playing) await queue.play();
		return true;
	}
	
	async playlist(msg, list) {
		let { guild, member } = msg;

		let musicUser = this.client.musicUsers[msg.author.id];
		if(!musicUser) return false;
		
		let joined = await this.join(msg);
		if(!joined) return false;

		let queue = await this.connect(msg);
		if(!queue) return false;

		let ary = [];
		for(let i in list) {
			let url = list[i];
			let res = await this.player.search(url, {
	      requestedBy: member,
	      searchEngine: QueryType.AUTO
	    });
			let track = res.tracks[0];
			let t = musicUser.find(s => s.url == track.url);
			if(t) {
				track.title = t.title;
				track.url = t.url;
				track.thumbnail = t.thumbnail;
				track.description = t.description;
				track.views = t.views;
				track.likes = t.likes;
				track.duration = t.duration;
				track.authorId = t.authorId;
			}
			ary.push(track);
		}
		queue.addTracks(ary);
		
		msg.channel.send({
			embeds: [createEmbed(`從播放清單加入 ${list.length} 首歌曲`)]
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
      return `${i + 1}. [**${m.title}**](${m.url})`;
    }).join("\n\n");
		if(queue.tracks.length > 10) tracks += "\n**...**";
		let duration = 0;
		queue.tracks.forEach(t => {
			let time = t.duration.split(":");
			duration += Number(time[0]) * 60 + Number(time[1]);
		});
		duration += Number(currentTrack.duration.split(":")[0]) * 60 + Number(currentTrack.duration.split(":")[1]);
		let date = new Date(duration * 1000).toISOString().substr(11, 8);
		
    msg.channel.send({
			embeds: [createEmbed(
				"播放隊伍", 
				null, 
				null, 
				tracks, 
				[
					{
						name: "Tracks",
						value: queue.tracks.length+1,
						inline: true
					},
					{
						name: "Duration",
						value: date,
						inline: false
					},
					{
						name: "現正播放", 
						value: `[**${currentTrack.title}**](${currentTrack.url})`
					}
				],
				currentTrack.thumbnail,
			)]
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
		mode = QueueRepeatMode[mode];
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
		if (!queue || !queue.playing) {
			msg.reply({
				content: setting.music.noMusic,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		let success = queue.setVolume(vol);
		if(success) {
			msg.channel.send({
				embeds: [createEmbed(`音量調整為 ${vol}%`)]
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

	async filter(msg, f) {
		let queue = await this.connect(msg);
		if (!queue || !queue.playing) {
			msg.reply({
				content: setting.music.noMusic,
				allowedMentions: setting.allowedMentions
			});
			return false;
		}
		let options = {};
		options[f] = !queue.getFiltersEnabled().inludes(f);
		await queue.setFilters(options).catch(err => {
			log(client, err);
		});
		msg.channel.send({
			embeds: [createEmbed(`過濾器設置為 ${f}`)]
		});
	}
};
