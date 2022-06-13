/* 將資料傳送到紀錄頻道 */
module.exports = (client, msg , type = "error") => {
  try {
    const channel = client.channels.cache.get(process.env.logChannel);
		if(type == "nornal") {
			channel.send(msg);
		} else {
			channel.send("`系統錯誤 - " + `${msg.toString()}` + "`");
		}
    
  } catch (err) {
    console.log(err);
  }
}