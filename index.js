const express = require('express');
const bodyParser = require('body-parser');
const rescue = require('express-rescue');
const { getFsTalker } = require('./fsTalker');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', rescue(async (_req, res) => {
  const talker = await getFsTalker();
  res.status(200).json(talker);
}));

app.listen(PORT, () => {
  console.log('Online');
});
