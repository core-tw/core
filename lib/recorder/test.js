const fs = require("fs");
const stream = require("stream");
const path = require("path");
const { pipeline } = require("stream");
const https = require('https');
const fileType = "ogg";

class SplitStream extends stream.Readable {
    constructor() {

    }
}
