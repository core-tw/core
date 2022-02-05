var Data = {};

module.exports = (id, skill_id, sec) => {
  if(!Data[id]) {
    Data[id] = {};
  }
  
  // 技能可用
  if(!Data[id][skill_id]) return false;

  Data[id][skill_id] = [Date.now(), sec * 1000];
  setTimeout(()=>{
    delete Data[id][skill_id];
  }, sec * 1000);
  
  return Data[id][skill_id];
}