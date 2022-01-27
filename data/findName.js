module.exports = (data, name) => {
  for(let item in data){
    if(item == name) {
      return data[item]['ID'];
    }
  }
  return false;
}