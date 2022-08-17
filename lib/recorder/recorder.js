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
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const prism = require("prism-media");
const ffmpeg = require("ffmpeg");
//const lamejs = require("lamejs");
const channels = {};
const opusStreams = {};
const outStreams = {};

const createListeningStream = (receiver, userId, channelId) => {
	const filename = `./public/recordings/users/${channelId}.ogg`;
	const opusStream = receiver.subscribe(userId, {
		end: {
            //behavior: EndBehaviorType.AfterSilence,
			behavior: EndBehaviorType.Manual
            //duration: 100,
        }
	});

	opusStreams[channelId] = opusStream;

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

	outStreams[channelId] = out;

	pipeline(opusStream, oggStream, out, (err) => {
		if (err) {
            console.warn(`❌ Error recording file `, err);
        } else {
            console.log(`✅ Recorded`);
        }
	});
}

module.exports.channels = channels;

module.exports.start = async (msg, channel, id) => {
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

	let started = false;
	
	receiver.speaking.on("start", (userId) => {
		if(id !== userId) return;
		if(started) return;
		started = true;
        createListeningStream(receiver, userId, channel.id);
    });
}

module.exports.end = (msg, channel) => {
	if(!channels[channel.id]) return;

	opusStreams[channel.id].destroy();
	outStreams[channel.id].on('close', async () => {
		channels[channel.id].destroy();
		channels[channel.id] = null;
		opusStreams[channel.id] = null;
		outStreams[channel.id] = null;
		
		const filename = path.join(
			__dirname, 
			`../../public/recordings/users/${channel.id}`
		);
	
		await msg.channel.send({
			files: [
				new MessageAttachment(
					`${filename}.ogg`,
					`recording-${Date.now()}.ogg`
				)
			]
		}).catch(err => console.log(err));
		
		fs.unlinkSync(`${filename}.ogg`);	
	});
	return;
	/*
	try {
		const process = new ffmpeg(`${filename}.pcm`);
    	process.then(function (audio) {
	        audio.fnExtractSoundToMP3(`${filename}.mp3`, async  (error, file) => {
		        await msg.channel.send({
				    files: [
						new MessageAttachment(
							`${filename}.mp3`,
							"recording.mp3"
						)
					]
				}).catch(err => console.log(err));
				//fs.unlinkSync(`${filename}.pcm`);
				//fs.unlinkSync(`${filename}.mp3`);	
			    console.log(`✅ send`);
			});
	    }, (err) => {
			console.warn(`❌ Error convert file `, err);	
	    });
		
		const cmd = `-y -f s16be -ac 2 -ar 44100 -acodec pcm_s16le -i ${path.join(__dirname, filename)}.pcm`;
		const readMp3 = new prism.FFmpeg({
			args: cmd.split(" ")
		});
		const writeMp3 = fs.createWriteStream(`${filename}.mp3`);

		pipeline(readMp3, writeMp3, async (err) => {
			if (err) {
	            console.warn(`❌ Error convert file `, err);
	        } else {
				await msg.channel.send({
		            files: [
						new MessageAttachment(
							`./recordings/${channel.id}.mp3`,
							"recording.mp3"
						)
					]
		        }).catch(err => console.log(err));
				fs.unlinkSync(`${filename}.pcm`);
		        fs.unlinkSync(`${filename}.mp3`);	
	            console.log(`✅ send`);
	        }
		});
		
	} catch (err) {
		console.log(err)
	}
	*/
	
}