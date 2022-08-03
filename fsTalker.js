const fs = require('fs').promises;

const getFsTalker = () => {
  const talker = fs.readFile('./talker.json', 'utf-8')
    .then((file) => JSON.parse(file))
    .catch((_err) => []);
  return talker;
};

const setFsTalker = (talkers) => fs.writeFile('talker.json', JSON.stringify(talkers));

module.exports = { getFsTalker, setFsTalker };