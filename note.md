# note

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

// 技能
{
  "普通攻擊": {
    "ID": "s1",
    "等級需求": 5,
    "冷卻":10,
    "傷害加成": "攻擊力的幾倍",
    "精準度": "1 ~ 100%",
    "作用對象": "false = 作用在自身",
    "MP消耗": 10,
    "發動機率": "1 ~ 100%",
    "效果": {
      "血量回復": "1 ~ 100% (自己)",
      "生命回復": "1 ~ 100% (他人)",
      "MP傳輸": [
        "多少",
        "秒數"
      ],
      "攻擊力上升": [
        "多少",
        "秒數"
      ],
      "防禦力上升": [
        "多少",
        "秒數"
      ],
      "速度上升": [
        "多少",
        "秒數"
      ],
      "功速上升": [
        "多少",
        "秒數"
      ],
      "燒傷": "0 ~ 100%",
      "凍傷": "0 ~ 100%",
      "中毒": "0 ~ 100%",
      "麻痺": "0 ~ 100%"
    }
  }
}
```

cmd list:

info

物件-星圖

普通技能由等級解鎖 消耗HP發動

虛空技能則是消耗MP ( 虛空能量 )，有固定冷卻時間

