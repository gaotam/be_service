const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if(key === 'headers' && key in object){
      obj['headers'] = object[key];
    } else if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = pick;