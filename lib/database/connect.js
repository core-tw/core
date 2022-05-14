const mongoose = require("mongoose");
module.exports = () => {
  mongoose.connect(process.env.mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose;
}