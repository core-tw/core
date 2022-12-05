const STREAM_NAME = location.href.split("?fname=")[1];

const permittedGetUserMedia = () => {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

const sendFile = (file, chunkNumber) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("name", STREAM_NAME);
    formData.append("chunk", chunkNumber);

    fetch("/webcamupload", {
        method: "PUT",
        body: formData
    });
}

const processStream = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    let countUploadChunk = 0;

    mediaRecorder.ondataavailable = (data) => {
        sendFile(data.data, countUploadChunk);
        countUploadChunk++
    }

    mediaRecorder.start();

    setInterval(() => {
        mediaRecorder.requestData();
    }, 1000)
}

if (permittedGetUserMedia()) {
    const video = document.querySelector("video");
    navigator.mediaDevices.getUserMedia({
		audio: true,
        video: true
    }).then((stream) => {
		video.srcObject = stream;
		processStream(stream);
		
	});
}