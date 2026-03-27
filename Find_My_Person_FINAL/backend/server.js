const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('./database');

let UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(__dirname, 'uploads');

try {
    if (!fs.existsSync(UPLOADS_PATH)) {
          fs.mkdirSync(UPLOADS_PATH, { recursive: true });
    }
} catch (err) {
    console.warn("Could not create persistent uploads directory, falling back to project root uploads.", err.message);
    UPLOADS_PATH = path.join(__dirname, 'uploads');
    if (!fs.existsSync(UPLOADS_PATH)) {
          fs.mkdirSync(UPLOADS_PATH, { recursive: true });
    }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_PATH));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
          cb(null, UPLOADS_PATH)
    },
    filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

app.post('/api/reports', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
  { name: 'fir', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
  ]), (req, res) => {
    try {
          const { name, last_seen_location, last_seen_date, contact, fir_number } = req.body;
          const photo_url = req.files && req.files['photo'] ? `/uploads/${req.files['photo'][0].filename}` : null;
          const aadhar_url = req.files && req.files['aadhar'] ? `/uploads/${req.files['aadhar'][0].filename}` : null;
          const fir_url = req.files && req.files['fir'] ? `/uploads/${req.files['fir'][0].filename}` : null;
          const selfie_url = req.files && req.files['selfie'] ? `/uploads/${req.files['selfie'][0].filename}` : null;

      const stmt = db.prepare(`
            INSERT INTO reports 
                  (name, last_seen_location, last_seen_date, contact, fir_number, photo_url, aadhar_url, fir_url, selfie_url) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `);
          const info = stmt.run(name, last_seen_location, last_seen_date, contact, fir_number, photo_url, aadhar_url, fir_url, selfie_url);
          res.json({ success: true, reportId: info.lastInsertRowid });
    } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/reports/verified', (req, res) => {
    try {
          const reports = db.prepare("SELECT * FROM reports WHERE status = 'verified' ORDER BY created_at DESC").all();
          res.json(reports);
    } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/reports/solved', (req, res) => {
    try {
          const reports = db.prepare("SELECT * FROM reports WHERE status = 'found' ORDER BY created_at DESC").all();
          res.json(reports);
    } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/admin/reports/pending', (req, res) => {
    try {
          const reports = db.prepare("SELECT * FROM reports WHERE status = 'pending' ORDER BY created_at ASC").all();
          res.json(reports);
    } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/admin/reports/:id/status', (req, res) => {
    try {
          const { status } = req.body;
          const stmt = db.prepare("UPDATE reports SET status = ? WHERE id = ?");
          stmt.run(status, req.params.id);
          res.json({ success: true });
    } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
    }
});

const DIST_PATH = path.resolve(process.cwd(), 'frontend/dist');
const INDEX_HTML = path.join(DIST_PATH, 'index.html');
app.use(express.static(DIST_PATH));
app.get('*', (req, res) => {
    if (fs.existsSync(INDEX_HTML)) {
          res.sendFile(INDEX_HTML);
    } else {
          res.status(404).send('Backend Live. Frontend Build Missing.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running');
});
