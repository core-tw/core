# 指令樣板
```js
module.exports = {
	num: 1,
	name: ['遊戲開始', '開始遊戲', 'start'],
	type: "others",
	expectedArgs: '',
	description: '開始冒險吧～',
	minArgs: 0,
	maxArgs: 0,
	level: null,
	cooldown: null,
	requireItems: [],
	requireBotPermissions: ["MANAGE_MESSAGES"],
	async execute(msg, args, client, user) {
	    try {
			msg.react('✅');			
			if(!user) {
				msg.reply({
					content: `您還沒有帳戶喔`,
					allowedMentions: config.allowedMentions
				});
				return;
			}
			
		} catch (err) {
			console.log(err);
			log(client, err.toString());
		}
  }
}
```

# embed備忘
```js
const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
```

# 血量上升公式
a = x/10  - [x/10]

y = 0.5 × [x/10] × (20×a^4 + 10×[x/10] + [x])

# UUID規範
1. 位置，星球=星球，地區=星球 + 地區
2. 物品，物品=分類 + 物品
3. 小怪，星球 + 地區 + 小怪

