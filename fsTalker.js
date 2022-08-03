const fs = require('fs').promises;

const getFsTalker = () => {
  const talker = fs.readFile('./talker.json', 'utf-8')
    .then((file) => JSON.parse(file))
    .catch((_err) => []);
  return talker;
};

module.exports = { getFsTalker };