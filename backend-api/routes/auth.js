const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const USERS_FILE = './data/users.json';
const SECRET = 'rahasia';

const readUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

router.post('/register', (req, res) => {
  const { nama, email, password } = req.body;
  const users = readUsers();
  const existing = users.find(u => u.email === email);

  if (existing) return res.status(400).json({ error: true, message: 'Email already used' });

  const hashed = bcrypt.hashSync(password, 8);
  users.push({ id: `user-${Date.now()}`, nama, email, password: hashed });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ error: false, message: 'User created' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: true, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET);
  res.json({
    error: false,
    message: 'success',
    loginResult: {
      userId: user.id,
      name: user.nama,
      token
    }
  });
});

module.exports = router;
