const Users = require("./../models/User.js");
module.exports = async id => {
    const user = await Users.findOne({
        userId: id,
    });
    if (user) return user;
    else {
        return null;
    }
}
