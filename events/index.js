// 包裹events
const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    let eventFiles = fs.readdirSync(__dirname).filter(file => file != __filename.replace(__dirname, ""));
    for (const file of eventFiles) {
        const event = require(path.join(__dirname, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}
