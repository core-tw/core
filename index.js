const fs = require("fs");
const express = require("express");
const { Client, Intents, Collection } = require("discord.js");

const config = require("./config.js");

const { database: { connect }, functions: { connectWeb } } = require("./lib/index.js");

(async () => {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_VOICE_STATES
        ]
    });

    client.login(process.env.token).then(() => {/*
        setTimeout(() => {
            // node_modules/.bin/node --trace-warnings ./index.js
            require("child_process").exec("kill 1", (error, stdout, stderr) => {
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
        }, 30000);*/
    });

    // 捕捉異常錯誤
    process.on("uncaughtException", (err) => {
        console.error("未捕捉的異常錯誤", err.message);
    });

    process.on("unhandledRejection", (err, promise) => {
        console.error("未捕捉的失敗回傳", err.message);
    });
    // 事件監聽
    console.log(config["console_prefix"] + "載入事件監聽");
    require("./events/index.js")(client);

    const app = express();
    let firstThreePing = [];
    app.get("/", async (req, res) => {
        let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        if (firstThreePing.includes(ip)) return;
        if (!firstThreePing.includes(ip) && firstThreePing.length < 3) return firstThreePing.push(ip);
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

    app.listen(config["port"], () => {
        console.log(
            config["console_prefix"] +
            `連接至 core.coretw.repl.co:${config["port"]}`
        );
    });

    module.exports = client;
})();
