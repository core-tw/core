const fs = require("fs");
//const { Blob } = require("buffer");
const lamejs = require("lamejstmp");

const mp3encoder = new lamejs.Mp3Encoder(1, 44100, 128); //mono 44.1khz encode to 128kbps
const samples = Buffer.from(fs.readFileSync("./recordings/904733596240216109.pcm", "base64"), "base64")
const mp3 = mp3encoder.encodeBuffer(samples); //encode mp3

fs.writeFileSync("./recordings/test.mp3", Buffer.from(mp3))
//const blob = new Blob(mp3, { type: 'audio/mp3' });
// new File([blob], "./recordings/test.mp3", { type: "audio/mp3" });

