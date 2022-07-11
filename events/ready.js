const config = require("./../config.js");
const { Collection } = require("discord.js");
const { database: { connect }, Music } = require("./../lib/index.js");
const Database = require("@replit/database");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        //console.clear();
        console.log(config.console_prefix + "core 啟動中");
        console.time(config.system_time);
        await client.user.setPresence({
            status: "online"
        });
        await client.user.setActivity("RPG", {
            type: "PLAYING"
        });

        // 與mongoDB連接
        console.log(config.console_prefix + "連結至雲端資料庫");
        await connect();

        // 將指令添加進Collection
        console.log(config.console_prefix + "正在載入指令");
        client.commands = await require("./../commands/index.js")();
        console.log(config.console_prefix + "指令生成完畢，已輸入至 ./log/commands.txt");

        // 指令冷卻的Collection
        console.log(config.console_prefix + "重置指令冷卻");
        client.cooldowns = new Collection();

        // 音樂模組
        console.log(config.console_prefix + "正在載入音樂模組");
        client.music = new Music(client);

        // 資料庫
        console.log(config.console_prefix + "正在載入資料庫");
        client.db = new Database();

        // 伺服器設定
        console.log(config.console_prefix + "正在載入設定資料檔");
        client.servers = await client.db.get("servers");
        if (!client.servers) {
            await client.db.set("servers", {});
            client.servers = {};
        }

        // 使用者設定
        console.log(config.console_prefix + "正在載入使用者設定");
        client.musicUsers = await client.db.get("musicUsers");
        if (!client.musicUsers) {
            await client.db.set("musicUsers", {});
            client.musicUsers = {};
        }
    }
}