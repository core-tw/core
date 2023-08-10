const {
    joinVoiceChannel,
    VoiceReceiver,
    EndBehaviorType,
    entersState,
    VoiceConnectionStatus,
    createAudioResource,
    createAudioPlayer,
    StreamType
} = require("@discordjs/voice");
const {
    MessageAttachment
} = require("discord.js");
const fs = require("fs");
const stream = require("stream");
const path = require("path");
const { pipeline } = require("stream");
const prism = require("prism-media");
const https = require('https');
const channels = {};
const opusStreams = {};
const outStreams = {};
const fileType = "ogg";
const chunks = [];
let chunkSize = 0;

const createListeningStream = (receiver = new VoiceReceiver(), userId, channelId) => {
    const filename = `./public/recordings/users/${channelId}.${fileType}`;
    const opusStream = receiver.subscribe(userId, {
        end: {
            //behavior: EndBehaviorType.AfterSilence,
            behavior: EndBehaviorType.Manual
            //duration: 100,
        },
        mode: {}
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
        crc: false
    });


    const out = fs.createWriteStream(filename);

    outStreams[channelId] = out;

    /*
    oggStream.on("data", (chunk) => {
        chunks.push(chunk);
        chunkSize += chunk.length;
    });

    oggStream.on('end', () => {
        let data = null;
        switch (chunks.length) {
            case 0: data = new Buffer(0);
                break;
            case 1: data = chunks[0];
                break;
            default:
                data = new Buffer(chunkSize);
                for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
                    let chunk = chunks[i];
                    chunk.copy(data, pos);
                    pos += chunk.length;
                }
                break;
        }
    });*/

    pipeline(opusStream, oggStream, out, (err) => {
        console.log(err)
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
        if (id !== userId) return;
        if (started) return;
        started = true;
        createListeningStream(receiver, userId, channel.id);
    });
}

module.exports.end = (msg, channel) => {
    if (!channels[channel.id]) return;

    //opusStreams[channel.id].destroy();
    channels[channel.id].destroy();
    if (outStreams[channel.id]) {
        outStreams[channel.id].on('close', async () => {
            //channels[channel.id].destroy();
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
                        `${filename}.${fileType}`,
                        `recording-${Date.now()}.${fileType}`
                    )
                ]
            }).catch(err => console.log(err));

            fs.unlinkSync(`${filename}.${fileType}`);
        });
    }

    return;
}

module.exports.play = async (msg) => {
    let { channel, member, reference } = msg;

    let connection = joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId: channel.guild.id,
        selfDeaf: true,
        selfMute: false,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    let oggPlayer = createAudioPlayer();

    let fileMsg = await msg.channel.messages.fetch(reference.messageId);
    let oggFile = fileMsg.attachments.first();
    if (!oggFile) return;
    oggFile = oggFile.url;
    if (!oggFile.endsWith(".ogg")) return;

    https.get(oggFile, (stream) => {
        let resource = createAudioResource(
            stream, {
            inputType: StreamType.OggOpus,
        });

        connection.subscribe(oggPlayer);
        oggPlayer.play(resource);
    });

}
