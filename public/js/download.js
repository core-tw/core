let data = window.location.href.split("?")[1].split("&");
let dir = data[0].split("=")[1];
let channelId = data[1].split("=")[1];
let users = data[2].split("=")[1].split("-");
let baselink = `./public/recordings/${dir}/${channelId}/`;

const srcs = users.map(id => {
    return baselink + `${id}.ogg`;
});

const getArrayBuffer = (src) => {
    return new Promise((resovle, reject) => {
        fetch(src).then(buf => buf.arrayBuffer()).then(arrbuf => resovle(arrbuf))
            .catch(err => reject(err));
    });
}

const sleep = (ms) => {
	return new Promise((res) => {
		setTimeout(() => {
			res();
		}, ms)
	});
}
window.onclick = async () => {
    window.onclick = null;
    window.MediaRecorder = OpusMediaRecorder;

    let div = document.querySelector("div");

    let nodes = [];

    let audio = new AudioContext();

    let context = null;
    let len = 0;

    let merger = audio.createChannelMerger(srcs.length);

    let mixedAudio = audio.createMediaStreamDestination();

    let maxDuration = 0;

    let mediaRecorder = null;

    let audioBuffers = [];

    //recorder.stop();

    let errors = 0;
    for (let i in srcs) {
        let error = null;
        let source = await getArrayBuffer(srcs[i])
            .catch(err => {
                error = err;
                console.error(err);
            });
        len = source.byteLength > len ? source.byteLength : len;

        let audioBuffer = await audio.decodeAudioData(source)
            .catch(err => {
                error = err;
                console.error(err);
            });

        if (error) {
            audioBuffers[i] = null;
            errors++;
            continue;
        }		

        audioBuffers[i] = audioBuffer;

        maxDuration = audioBuffers[i].duration > maxDuration ? audioBuffers[i].duration : maxDuration;
    }

    if (srcs.length <= errors) {
        div.innerHTML = "下載失敗 - 發生重大錯誤或者音檔沒有任何內容"
        return;
    }

    context = new OfflineAudioContext(2, len, 44100);

    console.log("maxDuration", maxDuration);

    for (let i in audioBuffers) {
		if(!audioBuffers[i]) continue;
		console.log(audioBuffers[i]);
        nodes[i] = context.createBufferSource();
        nodes[i].buffer = audioBuffers[i];
        nodes[i].connect(context.destination);
        nodes[i].start();
    }
	console.log(context)
	//await sleep(3000)
    let renderedBuffer = await context.startRendering();

	console.log("renderedBuffer", renderedBuffer);

    let mix = audio.createBufferSource();
    mix.buffer = renderedBuffer;

    mix.connect(audio.destination);
    mix.connect(mixedAudio);

    mediaRecorder = new MediaRecorder(mixedAudio.stream, {
        mimeType: "audio/ogg; codecs=opus"
    }, {
        OggOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/OggOpusEncoder.wasm',
        WebMOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/WebMOpusEncoder.wasm'
    });

    mix.start(0);

    mediaRecorder.start();

    let timer = setTimeout(() => {
        mix.stop();
        mediaRecorder.stop();
    }, maxDuration * 1000);

    mediaRecorder.ondataavailable = (evt) => {
        // 針對錄製檔案的處理 ...
        console.log("data: ", evt.data)
        let blob = evt.data;

        //let blob = new Blob([chunk], { type: 'audio/webm; codecs=opus' });
        //console.log(blob);
        //let file = new File([blob], "recording.ogg", {
        //    type: blob.type,
        //});

        let download = document.getElementById("download");
        download.innerHTML = "download";
        download.href = window.URL.createObjectURL(blob);
        download.download = `recording-${new Date().toLocaleString()}.ogg`;
    };
};