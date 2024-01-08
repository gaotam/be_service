const exclude = (obj, keys) => {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
};

module.exports = exclude