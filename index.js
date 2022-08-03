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

app.get('/talker/:id',  rescue(async (req, res) => {
  const { id } = req.params;
  const talkers = await getFsTalker();
  const idTalker = talkers.find((talker) => talker.id === parseInt(id, 10));
  !idTalker ? res.status(404).json({ message: 'Pessoa palestrante não encontrada'}) : res.status(200).json(idTalker);
}));

app.listen(PORT, () => {
  console.log('Online');
});
