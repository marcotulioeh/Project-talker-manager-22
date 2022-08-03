const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const rescue = require('express-rescue');
const crypto = require('crypto');
const { getFsTalker, setFsTalker } = require('./fsTalker');
const {
  checkEmail,
  checkPassword,
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkWatchedAt,
  checkRate,
} = require('./tokenValidation');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', checkToken, rescue(async (req, res) => {
  const search = req.query.q;
  const talkerJson = await fs.readFile('talker.json');
  const talker = await JSON.parse(talkerJson);
  const talkerFilter = talker.filter((talk) => talk.name.includes(search));
  if (!search || search === '') {
    return res.status(200).json(talker);
  }
  return res.status(200).json(talkerFilter);
}));

app.get('/talker', rescue(async (_req, res) => {
  const talker = await getFsTalker();
  res.status(200).json(talker);
}));

app.get('/talker/:id', rescue(async (req, res) => {
  const { id } = req.params;
  const talkers = await getFsTalker();
  const idTalker = talkers.find((talker) => talker.id === parseInt(id, 10));
  if (!idTalker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(idTalker);
}));

app.post('/login', checkEmail, checkPassword, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token: `${token}` });
});

app.post(
  '/talker',
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkRate,
  checkWatchedAt,
  rescue(async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkerJson = await fs.readFile('talker.json');
    const talker = await JSON.parse(talkerJson);
    const talkers = {
      id: talker.length + 1,
      name,
      age,
      talk: { watchedAt, rate },
    };
    const newFileTalkers = [...talker, talkers];
    await setFsTalker(newFileTalkers);
    return res.status(201).json(talkers);
    }),
  );

app.put(
  '/talker/:id',
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkRate,
  checkWatchedAt,
  rescue(async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const { id } = req.params;
    const talkerJson = await fs.readFile('talker.json');
    const talkerParse = await JSON.parse(talkerJson);
    const talkerIndex = talkerParse.findIndex((talker) => talker.id === parseInt(id, 10));
    const newTalker = {
      id: parseInt(id, 10),
      name,
      age,
      talk: { watchedAt, rate },
    };
    const newTalkers = [...talkerParse];
    newTalkers[talkerIndex] = newTalker;
    await setFsTalker(newTalkers);
    return res.status(200).json(newTalker);
  }),
);

app.delete('/talker/:id', checkToken, rescue(async (req, res) => {
  const { id } = req.params;
  const talkerJson = await fs.readFile('talker.json');
  const talker = await JSON.parse(talkerJson);
  const talkerFilter = talker.filter((talk) => talk.id !== parseInt(id, 10));
  await setFsTalker(talkerFilter);
  return res.status(204).json({ message: 'Pessoa palestrante deletada com sucesso' });
}));

app.listen(PORT, () => {
  console.log('Online');
});
