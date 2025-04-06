const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const ACCOUNTS_FILE = path.join(__dirname, 'storage/accounts.json');

app.get('/accounts', (req, res) => {
  fs.readFile(ACCOUNTS_FILE, 'utf-8', (err, data) => {
    if (err) {
      console.error('Failed to load accounts.json:', err.message);
      return res.status(500).json({ error: 'Failed to load accounts.json' });
    }

    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch (parseErr) {
      res.status(500).json({ error: 'Invalid JSON in accounts.json' });
    }
  });
});

app.post('/run-gpt', (req, res) => {
  const { email } = req.body;
  console.log(`🧠 Running GPT script for ${email}`);

  exec(`node scripts/doc_upgrader_test.js`, (error, stdout, stderr) => {
    if (error) {
      console.error(`GPT Error: ${error.message}`);
      return res.status(500).json({ message: 'GPT task failed.' });
    }
    console.log(stdout);
    res.json({ message: 'GPT task completed.' });
  });
});

app.post('/build-site', (req, res) => {
  const { email } = req.body;
  console.log(`🌍 Running Site Generator for ${email}`);

  exec(`node scripts/gsite_generator_v2.js`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Site Generator Error: ${error.message}`);
      return res.status(500).json({ message: 'Site builder failed.' });
    }
    console.log(stdout);
    res.json({ message: 'Site build completed.' });
  });
});

app.listen(PORT, () => {
  console.log(`🧠 RankRocket API running at http://localhost:${PORT}`);
});
