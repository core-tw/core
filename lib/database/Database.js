const fs = require("fs");
const path = require("path");

module.exports = class Database {
    constructor() {
        this.path = path.join(__dirname, "../../JSONDatabase/data.json");
        this.backup_path = path.join(__dirname, "../../JSONDatabase/backup.json");
        this.data = require(this.path);
        this.oldStringData = this.j2s();
        this.backup();
    }
    get = (str) => new Promise((res, rej) => {
        if (typeof str == "string") {
            res(this.data[str] || null);
        } else {
            res(null);
        }
    });
    set = (str, obj) => new Promise((res, rej) => {
        if (typeof str == "string") {
            this.data[str] = obj;
            this.newStringData = this.j2s();
            try {
                this.save();
            } catch (err) {
                console.log(err)
                this.data = JSON.parse(fs.readFileSync(this.backup_path));
            }
            this.oldStringData = this.newStringData;
            this.backup();

            res();
        }
    });
    j2s = () => {
        return JSON.stringify(this.data, null, 4);
    }
    save = () => {
        fs.writeFileSync(this.path, this.newStringData);
    }
    backup = () => {
        fs.writeFileSync(this.backup_path, this.oldStringData);
    }
}