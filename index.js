const fs = require("fs");
const path = require("path");
//const bodyParser = require('body-parser')
const express = require("express");
//const fileUpload = require("express-fileupload");
const { Client, Intents, Collection } = require("discord.js");

const config = require("./config.js");

const { database: { connect }, functions: { connectWeb } } = require("./lib/index.js");

const makeDirnameFilename = (name, chunk) => {
	const dirname = `/public/uploads/${name}`;
	const filename = `${dirname}/${chunk}.webm`;
	return [dirname, filename];
}
	
(async () => {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_VOICE_STATES
        ]
    });

    client.login(config["token"]).then(() => {
        setTimeout(() => {
			if (client.isReady()) return;
            // node_modules/.bin/node --trace-warnings ./index.js
            require("child_process").exec("kill 1 ; node_modules/.bin/node --trace-warnings ./index.js", (error, stdout, stderr) => {
                console.log(stdout.toString(), stderr.toString());
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                } else {
                    setTimeout(() => {
                        require("child_process").exec(
                            "node_modules/.bin/node --trace-warnings ./index.js",
                            () => { });
                    }, 30000);
                }
            });
        }, 30000);
    });

    // 捕捉異常錯誤
    process.on("uncaughtException", (err) => {
       	console.error("未捕捉的異常錯誤", err);
    });

    process.on("unhandledRejection", (err, promise) => {
        console.error("未捕捉的失敗回傳", err);
    });
    // 事件監聽
    console.log(config["console_prefix"] + "載入事件監聽");
    require("./events/index.js")(client);

    const app = express();
	//app.use(bodyParser.urlencoded())
	//app.use(bodyParser.json())
	//app.use(fileUpload({
	//    useTempFiles: true,
	//    tempFileDir: '/public/tmp'
	//}))

	app.use('/public', express.static(__dirname + '/public'));

    let firstThreePing = [];
    app.get("/", async (req, res) => {
        let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        if (firstThreePing.includes(ip)) return res.send(`Core is ready.`);
        if (!firstThreePing.includes(ip) && firstThreePing.length < 3) {
			firstThreePing.push(ip);
			res.send(`Core is ready.`);
			return 
		}
        connectWeb(
            client,
            `\`IP ${ip} connect to core.coretw.repl.co/\``
        ).then(msg => {
            res.send(`Core is ready<br>========================================<br>uptime: ${client.uptime} ms<br>ws ping: ${client.ws.ping} ms`);
        }).catch(err => {
            res.send(`Core is offline.`);
            return;
        });
    });

	app.get("/download", async (req, res) => {
		res.sendFile(path.join(__dirname, "./public/html/download.html"));
	});

	app.get("/download", async (req, res) => {
		res.sendFile(path.join(__dirname, "./public/html/download.html"));
	});
	app.get("/webcam", async (req, res) => {
		res.sendFile(path.join(__dirname, "./public/html/webcam.html"));
	});
	/*
	app.put("/webcamupload", async (req, res) => {
		const file = req.files.file;
	    const [dirname, filename] = makeDirnameFilename(req.body.name, req.body.chunk);
	
	    fs.promises.mkdir(dirname, {recursive: true})
	        .then(
	            file.mv(filename)
	        )
	
	    res.statusCode = 200;
	    res.setHeader('Content-Type', 'text/plain');
	    res.end('Upload\n');
	});*/

    app.listen(config["port"], () => {
        console.log(
            config["console_prefix"] +
            `連接至 core.coretw.repl.co:${config["port"]}`
        );
    });
	
	module.exports = client;
})();
