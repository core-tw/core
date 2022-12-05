const fs = require("fs");
const path = require("path");

class Database {
    constructor(path) {
        this.path = path || "../../JSONDatabase/data.json";
        this.backup_path = path || "../../JSONDatabase/backup.json";
        this.data = require(this.path);
        this.oldStringData = this.j2s();
        this.backup();
    }
    get = (str) => {
        if (typeof str == "string") {
            return this.data[str] || null;
        } else {
            return null;
        }

    }
    set = (str, obj) => {
        if (typeof str == "string") {
            this.data[str] = obj;
            this.newStringData = this.j2s();
            try {
                save();
            } catch (err) {
                this.data = JSON.parse(fs.readFileSync(this.backup_path));
            }
            this.oldStringData = this.newStringData;
            backup();
        }
    }
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