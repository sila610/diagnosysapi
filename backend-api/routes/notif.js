const express = require('express');
const fs = require('fs');
const webpush = require('web-push');
const auth = require('../middleware/auth');
const router = express.Router();

const SUBSCRIBERS_FILE = './data/subscribers.json';

const VAPID_KEYS = {
  publicKey: 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk',
  privateKey: 'U_4WP-5sI1Ur36_G_yceWizzSrZCMHF1dzpWC1_yibU'
};

webpush.setVapidDetails(
  'mailto:alyamanda@example.com',
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

router.post('/notifications/subscribe', auth, (req, res) => {
  const subscriptions = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
  const { endpoint, keys } = req.body;

  subscriptions.push({ endpoint, keys, userId: req.user.id, createdAt: new Date() });
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscriptions, null, 2));

  res.json({ error: false, message: 'Success to subscribe web push notification.' });
});

router.post('/notifications/send', auth, (req, res) => {
  const subscriptions = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));

  const payload = JSON.stringify({
    title: 'Story berhasil dibuat',
    options: {
      body: `Anda telah membuat story baru dengan deskripsi: ${req.body.description}`
    }
  });

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });

  res.json({ error: false, message: 'Notifikasi dikirim ke semua subscriber' });
});

module.exports = router;
