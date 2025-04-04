// File: ads-api/src/fetch_campaigns.js
// Author: Skippy the Magnificent & George Penzenik
// Version: 1.04
// Date Modified: 18:58 04/04/2025
// Comment: Replaced require with dynamic import to fix node-fetch ESM compatibility in Node.js v20+

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { OAuth2Client } = require('google-auth-library');

// Load configuration and credentials
const CONFIG_PATH = path.join(__dirname, '../config/ads-config.json');
const CREDENTIALS_PATH = path.join(__dirname, '../auth/google-auth.json');
const TOKEN_PATH = path.join(__dirname, '../token/ads-token.json');

async function loadCredentials() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_id, client_secret, redirect_uris } = credentials.installed;

    const auth = new OAuth2Client(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        auth.setCredentials(token);
    } else {
        const authUrl = auth.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/adwords'],
        });
        console.log('Authorize this app by visiting this URL:', authUrl);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const code = await new Promise(resolve => rl.question('Enter the code from that page here: ', resolve));
        rl.close();

        const { tokens } = await auth.getToken(code);
        auth.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('Token stored to', TOKEN_PATH);
    }

    return auth;
}

async function fetchCampaigns() {
    const auth = await loadCredentials();
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH));

    const accessToken = auth.credentials.access_token;
    const customerId = config.test_account_id;
    const query = `SELECT campaign.id, campaign.name, campaign.status FROM campaign LIMIT 10`;

    const fetch = (await import('node-fetch')).default;

    const response = await fetch(`https://googleads.googleapis.com/v15/customers/${customerId}/googleAds:search`, {

        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'developer-token': config.developer_token,
            'login-customer-id': config.manager_id,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API request failed: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('Campaigns:', JSON.stringify(data, null, 2));
}

fetchCampaigns();
