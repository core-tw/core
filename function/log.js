/* 將資料傳送到紀錄頻道 */
module.exports = (client, error) => {
	try {
		const channel = client.channels.cache.get(process.env.logChannel);
		channel.send("`系統錯誤 - " + `${error.toString()}` + "`");
	} catch(err) {
		console.log(err)
	}
}