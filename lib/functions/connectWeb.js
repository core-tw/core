/* 檢查是否下線 */
module.exports = (client, msg) => {
    return new Promise(async (resovle, reject) => {
        const channel = client.channels.cache.get(process.env.logChannel);
        let m = await channel.send(msg).catch(err => {
            reject(err);
        });
        resovle(m);
    })
}