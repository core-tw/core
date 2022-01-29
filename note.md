# note
銀行相關的指令<br>
背包要有 銀行卡 才能使用

所有物件都要有屬性 格數

area list<br>
0 母星

要有稱號 title

```
// 通用架構
const {  } = require('./../../_data_.js');
const {  } = require('./../../_database_.js');
const {  } = require('./../../_model_.js');
module.exports = {
  num: ,
  name: [],
  type: ,
  expectedArgs: '',
  description: '',
  minArgs: ,
  maxArgs: ,
  level: ,
  cooldown: ,
  requireObject: [],
  requirePermission: [],
  async execute(msg, args, user) {
  }
}
```
