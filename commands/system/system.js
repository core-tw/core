const data = require('./../../_data_.js');
const database = require('./../../_database_.js');
const model = require('./../../_model_.js');
module.exports = {
  num: 99,
  name: ["system"],
  type: "system",
  expectedArgs: 'warn!',
  description: 'system call',
  minArgs: null,
  maxArgs: null,
  level: null,
  cooldown: null,
  requireObject: [],
  requirePermission: [],
  async execute(msg, args, user) {
    if(msg.author.id !== "823885929830940682") return;
    await msg.react('✅');
    if(msg.content.includes("```")) {
      let code = msg.content.split("```")[1];
      if(code.length = 0) return;
      code.replace(/\n/g,";");
      try{
        eval(code);
      }catch(err) {
        console.log(err)
      }
    } else {
      let code = msg.content.replace(/\n/g,";").replace("!","").replace("system","").replace("call","");
      if(code.length = 0) return;
      try{
        eval(code);
      }catch(err) {
        console.log(err)
      }
    }
    
  }
}