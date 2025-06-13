const express = require('express');
const fs = require('fs');
const auth = require('../middleware/auth');
const router = express.Router();

const USERS_FILE = './data/users.json';

router.get('/profile', auth, (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: true, message: 'User not found' });

  res.json({
    nama: user.nama,
    email: user.email,
    tempat_tinggal: 'Yogyakarta',
    umur: 24,
    jenis_kelamin: 'Perempuan',
    riwayat_pemeriksaan: [
      {
        tanggal: '2025-06-01',
        diagnosa: 'Demam Berdarah',
        dokter: 'dr. Hendra',
        catatan: 'Dirawat 3 hari'
      },
      {
        tanggal: '2025-06-12',
        diagnosa: 'Flu',
        dokter: 'dr. Rina',
        catatan: 'Minum obat 3 hari'
      }
    ]
  });
});

module.exports = router;
