const mongoose = require("mongoose");
const { mongoPath } = require("../../config.js");

module.exports = () => {
    mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose;
}