const checkEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || email === '') {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!email.includes('@') || !email.includes('.com')) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const checkPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || !password === '') {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

// const checkToken = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token || token === '') {
//     return res.status(401).json({ message: 'Token não existe.' });
//   }
//   if (token.length !== 16) {
//     return res.status(401).json({ message: 'Este Token não é válido.' });
//   }
//   next();
// };

module.exports = {
  checkEmail,
  checkPassword,
  // checkToken,
};