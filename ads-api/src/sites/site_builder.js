// File: ads-api/src/sites/site_builder.js
// Author: Skippy the Magnificent & George Penzenik
// Version: 0.20 (Step 1: Site Creation)
// Date Modified: 20:12 04/04/2025
// Comment: Added Google Site creation using Sites API v1

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const CREDENTIALS_PATH = path.join(__dirname, '../../auth/google-auth.json');
const TOKEN_PATH = path.join(__dirname, '../../token/ads-token.json');

const SCOPES = [
    'https://www.googleapis.com/auth/siteverification',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/presentations',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/classroom.sites',
    'https://www.googleapis.com/auth/sites'
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

async function createGoogleSite(auth) {
    const sites = google.sites({ version: 'v1', auth });

    try {
        const res = await sites.sites.create({
            requestBody: {
                name: `site-${Date.now()}`,
                title: "RankRocket Project Site",
                summary: "Auto-generated site created using Google Sites API.",
            },
        });

        const site = res.data;
        console.log('🚀 Site created successfully!');
        console.log(`Site name: ${site.name}`);
        console.log(`Site ID: ${site.id}`);
        console.log(`Site URL: https://sites.google.com/view/${site.name}`);

        return site;
    } catch (err) {
        console.error('❌ Failed to create site:', err.message);
        if (err.errors) console.error(JSON.stringify(err.errors, null, 2));
    }
}

(async () => {
    const auth = await authorize();
    await createGoogleSite(auth);
})();
