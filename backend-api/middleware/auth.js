const jwt = require('jsonwebtoken');
const SECRET = 'rahasia'; // harus sama dengan di auth.js

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: true, message: 'Token not provided' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: true, message: 'Invalid token' });
  }
};
