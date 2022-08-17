const {
	joinVoiceChannel,
	VoiceReceiver,
	EndBehaviorType,
	entersState,
	VoiceConnectionStatus
} = require("@discordjs/voice");
const {
	MessageAttachment,
	MessageEmbed
} = require("discord.js");
const prism = require("prism-media");
const ffmpegPath = require("ffmpeg-static");

const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const cp = require("child_process")

const config = require("../../config.js");
const setting = require("../../config/setting.json");

const channels = {};

const createListeningStream = (receiver, userId, channelId, p) => {
	const filename = path.join(p, `${userId}.ogg`);
	
	const opusStream = receiver.subscribe(userId, {
		end: {
			behavior: EndBehaviorType.Manual
        }
	});

	channels[channelId].opusStreams[userId] = opusStream;

	const oggStream = new prism.opus.OggLogicalBitstream({
        opusHead: new prism.opus.OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 10,
        },
    });
	
	const out = fs.createWriteStream(filename);
	
	channels[channelId].outStreams[userId] = out;
	
	pipeline(opusStream, oggStream, out, (err) => {
		if (err) {
            console.warn(`❌ Error recording file `, err);
        } else {
            console.log(`✅ Recorded`);
        }
	});
}

module.exports.channels = channels;

const createEmbed = (text) => {
    let embed = new MessageEmbed()
        .setTitle("Recording..")
        .setColor(setting.embedColor.normal)
		.setDescription(text)
        .setFooter({ text: "core.record..." })
        .setTimestamp();
        
    return embed;
}

module.exports.start = async (client, msg, channel) => {
	const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        selfDeaf: false,
        selfMute: true,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    
	await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
	
    const receiver = connection.receiver;
	
	channels[channel.id] = connection;
	channels[channel.id].members = channel.members.filter(m => {
		return (client.user.id !== m.id);
	});
	channels[channel.id].opusStreams = {};
	channels[channel.id].outStreams = {};

	const p = path.join(__dirname, `../../public/recordings/channels/${channel.id}/`);
	fs.exists(p, (exists) => {
		if(!exists) fs.mkdirSync(p);
		channels[channel.id].members.forEach(member => {
			createListeningStream(receiver, member.id, channel.id, p);
		});
	});
}

module.exports.end = (client, msg, channel) => {
	if(!channels[channel.id]) return;
	let prepare = channels[channel.id].members.size;
	let users = [];
	let args = [];
	const p = path.join(
		__dirname, `../../public/recordings/channels/${channel.id}/`
	);
	channels[channel.id].members.forEach(member => {
		users.push(member.id);
		channels[channel.id].opusStreams[member.id].destroy();
		
		delete channels[channel.id].opusStreams[member.id];

		channels[channel.id].outStreams[member.id].end();
		
		channels[channel.id].outStreams[member.id].on("close", async () => {
			args = args.concat([
				"-i", 
				`${p + member.id}.ogg`
			]);
			prepare--;
			if(prepare == 0) {
				const link = config["host"] + "download" + 
				`?dir=channels&id=${channel.id}&files=${users.join("-")}&time=${Date.now()}`;

				console.log(users)
				if(users.length = 1) {
					await msg.channel.send({ 
						files: [
							new MessageAttachment(
								`${p + member.id}.ogg`,
								"recording.ogg"
							)
						]
					}).catch(err => console.log(err));
				} else {
					let m = await msg.channel.send({ 
						embeds: [
							createEmbed("音頻檔案合成中...")
						]
					});
					args = args.concat([
						`amix=inputs=${users.length}`,
						"pipe:3"
					]);

					let ffmpegProcess = cp.spawn(ffmpegPath, args, {
					    windowsHide: true,
						stdio: [
	                        "inherit", "inherit", "inherit", 
	                        "pipe",
	                    ]
					});
					
					await m.edit({ 
						embeds: [
							createEmbed("合成完畢！")
						],
						files: [
							new MessageAttachment(
								ffmpegProcess.stdio[3],
								"recording.ogg"
							)
						]
					}).catch(err => console.log(err));
				}
				channels[channel.id].destroy();
				delete channels[channel.id];
				setTimeout(() => {
					users.forEach((id) => {
						fs.unlinkSync(`${p + id}.ogg`);	
					});
				}, 10 * 60 * 1000);
			}
		});
	});
}