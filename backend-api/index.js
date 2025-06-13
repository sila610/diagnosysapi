const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const notifRoutes = require('./routes/notif');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (_, res) => res.send('API is running'));

// 📌 Tambahkan ini agar /api menampilkan info
app.get('/api', (_, res) => {
  res.json({
    message: 'Welcome to the API root endpoint!',
    available_endpoints: [
      { method: 'POST', path: '/api/register', description: 'Register a new user' },
      { method: 'POST', path: '/api/login', description: 'Login user and get token' },
      { method: 'GET',  path: '/api/profile', description: 'Get profile (needs token)' },
      { method: 'POST', path: '/api/notifications/subscribe', description: 'Subscribe for push notification (needs token)' }
    ]
  });
});

app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', notifRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
