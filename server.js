const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const GITHUB_TOKEN = 'tuo_token_github';
const REPO_OWNER = 'tuo_username';
const REPO_NAME = 'tuo_repository';

app.post('/update-file', async (req, res) => {
  const { path, content, message } = req.body;
  
  try {
    // 1. Ottieni SHA del file esistente
    const getFile = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    
    const sha = getFile.data.sha;
    
    // 2. Aggiorna il file
    const update = await axios.put(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        message: message || 'Aggiornamento dal web',
        content: Buffer.from(content).toString('base64'),
        sha: sha
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
