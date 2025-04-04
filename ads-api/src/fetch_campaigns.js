// File: ads-api/src/fetch_campaigns.js
// Author: Skippy the Magnificent & George Penzenik
// Version: 1.01
// Date Modified: 17:12 04/04/2025
// Comment: Fixed incorrect require for google-auth-library, updated OAuth2 instantiation

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { OAuth2Client } = require('google-auth-library');
const { GoogleAdsClient } = require('google-ads-api');

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

    // Try loading saved token
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

        const code = await new Promise(resolve => {
            rl.question('Enter the code from that page here: ', resolve);
        });
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

    const client = new GoogleAdsClient({
        developer_token: config.developer_token,
        login_customer_id: config.manager_id,
        auth,
    });

    const customer = client.Customer({
        customer_id: config.test_account_id,
        refresh_token: auth.credentials.refresh_token,
    });

    try {
        const campaigns = await customer.query(
            `SELECT campaign.id, campaign.name, campaign.status FROM campaign LIMIT 10`
        );
        console.log('Campaigns:', campaigns);
    } catch (err) {
        console.error('Error fetching campaigns:', err);
    }
}

fetchCampaigns();
