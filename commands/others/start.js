const Discord = require('discord.js');
const Player = require('./../../data/human/player.js');
const weapon = require('./../../data/weapon.js');
const object = require('./../../data/object.js');
const config = require('./../../data/config.json');
const findName = require('./../../data/findName.js');
const addItem = require('./../../database/addItem.js');

module.exports = {
  num: 0,
  name: ['start', "遊戲開始"],
  type: "others",
  expectedArgs: '',
  description: '開始冒險吧～',
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: null,
  requireObject: [],
  async execute(msg, User) {
    msg.react('✅');

    let player = new Player();
    let weaponList = [];

    User.findOne({
      userId: msg.author.id,
    }, async (err, user) => {
      if (user) {
        msg.lineReply("您已經擁有帳戶了喔");
        return;
      }
      let mainEmbed = new Discord.MessageEmbed()
        .setColor(config.embed_color)
        .setTitle(`╠══╬══ Creating player ══╬══╣`)
        .setThumbnail(msg.author.displayAvatarURL())
        .setFooter("此訊息將在2分鐘後失效");

      // 1.輸入姓名
      let nameEmbed = mainEmbed;
      nameEmbed
        .setDescription(`
        請直接輸入你的暱稱：`)
        .setTimestamp();

      msg.lineReply(nameEmbed).then(async (m) => {
        await m.channel.awaitMessages(filter1, { max: 1, time: 1200000, errors: ['time'] }).catch(err => { });

        // 2.輸入性別
        let genderEmbed = mainEmbed;
        genderEmbed
          .setDescription(`
          暱稱 - ${player.name}
          請反應下的表情符號決定性別 ♂️／♀️`)
          .setTimestamp();

        await m.edit(genderEmbed);
        await m.react('♂️');
        await m.react('♀️');
        await m.awaitReactions(filter2, { max: 1, time: 120000, errors: ['time'] }).catch(err => { });

        let weaponEmbed = mainEmbed;
        weaponEmbed
          .setDescription(`
          暱稱 - ${player.name}
          性別 - ${player.gender == "male" ? "男性" : "女性"}
          請輸入你的初始武裝：`)
          .setTimestamp();

        await m.edit(weaponEmbed);
        let mlist = {}
        for (let w in weapon) {
          weaponList.push(w);
          let embed = new Discord.MessageEmbed()
            .addField(w, weapon[w]['描述'], true);
          mlist[w] = await msg.channel.send(embed);
        }

        await m.channel.awaitMessages(filter3, { max: 1, time: 1200000, errors: ['time'] }).catch(err => { });

        let finalEmbed = mainEmbed;
        finalEmbed
          .setDescription(`
          暱稱 - ${player.name}
          性別 - ${player.gender == "male" ? "男性" : "女性"}
          初始武裝 - ${player.weapon}`)
          .setTimestamp()
          .setFooter("player created");

        await m.channel.send(finalEmbed);
        await m.delete()
        for (let w in mlist) {
          await mlist[w].delete()
        }

        var newuser = new User({
          userId: msg.author.id,
          name: player.name || msg.author.tag,
          gender: player.gender,
        });
        await newuser.save().catch(err => console.log(err));
        let add = await addItem(msg, newuser, object['公民證']['ID']);
        if (add === "error") return;
        msg.channel.send(config.additem.replace("item", "公民證"));
      });

    });

    let filter1 = (m) => {
      if (m.author.id != msg.author.id) return;
      player.name = m.content;
      m.react('✅');
      return true;
    }

    let filter2 = (reaction, user) => {
      if (user.id != msg.author.id) return;
      if (reaction.emoji.name == "♂️") {
        player.gender = "male";
        return true;
      } else if (reaction.emoji.name == "♀️") {
        player.gender = "female";
        return true;
      }
    }

    let filter3 = (m) => {
      if (m.author.id != msg.author.id) return;
      if (!weaponList.includes(m.content)) {
        m.lineReply(`請輸入正確的武裝名稱 [ **${weaponList.join("** | **")}** ]`);
      } else {
        player.weapon = m.content;
        m.react('✅');
        return true;
      }
    }
  }
}

/**
 * 1. 名子
 * 2. 性別
 * 3. 初始武器
 */
