// File: ads-api/src/sites/auth.js
// Author: Skippy the Magnificent & George Penzenik
// Version: 0.40
// Auth handler for all Google API interactions

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { OAuth2Client } = require('google-auth-library');

const CREDENTIALS_PATH = path.join(__dirname, '../../auth/google-auth.json');
const TOKEN_PATH = path.join(__dirname, '../../token/ads-token.json');

const SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.resource'
];

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const auth = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    auth.setCredentials(token);
  } else {
    const authUrl = auth.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log('Authorize this app by visiting this URL:', authUrl);

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const code = await new Promise(resolve => rl.question('Enter the code from that page here: ', resolve));
    rl.close();

    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', TOKEN_PATH);
  }

  return auth;
}

module.exports = { authorize };
