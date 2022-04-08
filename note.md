# 指令樣板
```js
const Discord = require('discord.js');
const { Users } = require('./../../_models_.js');
const { log } = require('./../../_functions_.js');
const {
	Maps,
	Player,
	GameInfo,
	UUID_PREFIX
} = require('./../../_enum_.js');
const config = require('./../../config.json');

// 為遊戲註冊帳號
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

# 提醒事項
- 冒險指令冷卻要改回15秒

# embed備忘
```js
// at the top of your file
const { MessageEmbed } = require('discord.js');

// inside a command, event listener, etc.
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

channel.send({ embeds: [exampleEmbed] });
```

# 血量上升公式
a = x/10  - [x/10]

y = 0.5 × [x/10] × (20×a^4 + 10×[x/10] + [x])
