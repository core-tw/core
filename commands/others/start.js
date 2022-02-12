const Discord = require('discord.js');
const { Weapons, Objects, Player, config, game_info, bodyType } = require('./../../_data_.js');
const { addItem } = require('./../../_database_.js');
const { User } = require('./../../_model_.js');
module.exports = {
  num: 0,
  name: ['遊戲開始', '開始遊戲', 'start'],
  type: "others",
  expectedArgs: '',
  description: '開始冒險吧～',
  minArgs: 0,
  maxArgs: 0,
  level: null,
  cooldown: null,
  requireObject: [],
  requirePermission: [],
  async execute(msg, args, user) {
    /**
     * 決定名子
     * 決定性別
     * 決定種族
     * 決定陣營
     */
    msg.react('✅');

    let player = new Player();
    let weaponList = [];

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

      let typeEmbed = mainEmbed;
      typeEmbed
        .setDescription(`
          暱稱 - ${player.name}
          性別 - **${player.gender == "male" ? "男性" : "女性"}**
          請反應下的表情符號決定型號：
          1. 基本型
          2. 強襲型
          3. 機動型
          4. 指揮型
          5. 特裝強化型`)
        .setTimestamp();

      let m2 = await m.channel.send(typeEmbed);
      await m2.react('1️⃣');
      await m2.react('2️⃣');
      await m2.react('3️⃣');
      await m2.react('4️⃣');
      await m2.react('5️⃣');
      await m2.awaitReactions(filter3, { max: 1, time: 120000, errors: ['time'] }).catch(err => { });

      let partyEmbed = mainEmbed;
      partyEmbed
        .setDescription(`
          暱稱 - ${player.name}
          性別 - **${player.gender == "male" ? "男性" : "女性"}**
          型號 - **${bodyType[player.type]['型號']}**
          陣營 - 請輸入陣營：
          **1. 軍隊**：選擇後可獲得基礎武裝，且殺死海盜可獲得高額獎勵，禁止武器交易

          **2. 海盜**：選擇後可獲得一台飛船，但是會被軍隊追殺

          **3. 平民**：選擇後可以獲得安穩的生活
           `)
        .setTimestamp()
        
      m2.edit(partyEmbed);
      await m.channel.awaitMessages(filter4, { max: 1, time: 1200000, errors: ['time'] }).catch(err => { });

      await m.delete();

      var newuser = new User({
        userId: msg.author.id,
        name: player.name || msg.author.tag,
        gender: player.gender,
        party: player.party,
        type: player.type
      });
      await newuser.save().catch(err => console.log(err));
      let add = await addItem(msg, newuser, Objects['公民證']['ID']);
      if (add === "error") return;
      msg.channel.send(config.additem.replace("item", "公民證"));

      add = await addItem(msg, newuser, Objects['母星通行證']['ID']);
      if (add === "error") return;
      msg.channel.send(config.additem.replace("item", "母星通行證"));

      if(player.party == "政府") {

      } else if(player.party == "海盜") {

      }
      //add = await addItem(msg, newuser, Weapons[player.weapon]['ID']);
      //if (add === "error") return;
      msg.channel.send(config.additem.replace("item", player.weapon));
      for(let i in game_info['start']) {
        setTimeout(async()=>{
          await msg.channel.send(game_info['start'][i]);
        },i*3500 + 3000);
      }
      
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

    let filter3 = (reaction, user) => {
      if (user.id != msg.author.id) return;
      switch(reaction.emoji.name) {
        case '1️⃣':
          player.type = 0;
          return true;
        case '2️⃣':
          player.type = 1;
          return true;
        case '3️⃣':
          player.type = 2;
          return true;
        case '4️⃣':
          player.type = 3;
          return true;
        case '5️⃣':
          player.type = 4;
          return true;
      }
    }

    let filter4 = (m) => {
      let list = ["軍隊", "海盜", "平民"];
      if (m.author.id != msg.author.id) return;
      if (!list.includes(m.content)) {
        m.lineReply(`請輸入正確的陣營名稱 [ **${list.join("** | **")}** ]`);
      } else {
        player.party = m.content;
        m.react('✅');
        return true;
      }
    }
  }
}

/* 舊版 
    msg.react('✅');

    let player = new Player();
    let weaponList = [];

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
      for (let w in Weapons) {
        weaponList.push(w);
        let embed = new Discord.MessageEmbed()
          .addField(w, Weapons[w]['描述'], true);
        mlist[w] = await msg.channel.send(embed);
      }

      await m.channel.awaitMessages(filter3, { max: 1, time: 1200000, errors: ['time'] }).catch(err => { });

      let typeEmbed = mainEmbed;
      typeEmbed
        .setDescription(`
          暱稱 - ${player.name}
          性別 - ${player.gender == "male" ? "男性" : "女性"}
          初始武裝 - ${player.weapon}
          請反應下的表情符號決定型號：
          1. 基本型
          2. 強襲型
          3. 機動型
          4. 指揮型
          5. 特裝強化型`)
        .setTimestamp()
        .setFooter("player creating");

      let m2 = await m.channel.send(typeEmbed);
      await m2.react('1️⃣');
      await m2.react('2️⃣');
      await m2.react('3️⃣');
      await m2.react('4️⃣');
      await m2.react('5️⃣');
      await m2.awaitReactions(filter4, { max: 1, time: 120000, errors: ['time'] }).catch(err => { });
      let finalEmbed = mainEmbed;
      finalEmbed
        .setDescription(`
          暱稱 - ${player.name}
          性別 - ${player.gender == "male" ? "男性" : "女性"}
          初始武裝 - ${player.weapon}
          型號 - ${bodyType[player.type]['型號']}`)
        .setTimestamp()
        .setFooter("player created");
        
      m2.edit(finalEmbed);
      await m.delete();
      for (let w in mlist) {
        await mlist[w].delete();
      }

      var newuser = new User({
        userId: msg.author.id,
        name: player.name || msg.author.tag,
        gender: player.gender,
        weapon: player.weapon,
        type: player.type
      });
      await newuser.save().catch(err => console.log(err));
      let add = await addItem(msg, newuser, Objects['公民證']['ID']);
      if (add === "error") return;
      msg.channel.send(config.additem.replace("item", "公民證"));

      add = await addItem(msg, newuser, Objects['母星通行證']['ID']);
      if (add === "error") return;
      msg.channel.send(config.additem.replace("item", "母星通行證"));

      add = await addItem(msg, newuser, Weapons[player.weapon]['ID']);
      if (add === "error") return;
      msg.channel.send(config.additem.replace("item", player.weapon));
      for(let i in game_info['start']) {
        setTimeout(async()=>{
          await msg.channel.send(game_info['start'][i]);
        },i*3500 + 3000);
      }
      
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

    let filter4 = (reaction, user) => {
      if (user.id != msg.author.id) return;
      switch(reaction.emoji.name) {
        case '1️⃣':
          player.type = 0;
          return true;
        case '2️⃣':
          player.type = 1;
          return true;
        case '3️⃣':
          player.type = 2;
          return true;
        case '4️⃣':
          player.type = 3;
          return true;
        case '5️⃣':
          player.type = 4;
          return true;
      }
    }
    */