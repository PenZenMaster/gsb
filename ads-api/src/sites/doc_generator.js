// File: ads-api/src/sites/doc_generator.js
// Author: Skippy the Magnificent & George Penzenik
// Version: 0.34 (Fix .env Loading with Explicit Path)
// Date Modified: 00:52 04/05/2025
// Comment: Loads .env explicitly from project root to avoid missing OPENAI_API_KEY

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { authorize } = require('./auth');
const OpenAI = require('openai');

require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

if (!process.env.OPENAI_API_KEY) {
    console.error('🚨 Missing OPENAI_API_KEY! Check your .env file and restart the app.');
    process.exit(1);
}

const CONFIG_PATH = path.join(__dirname, '../../config/client-config.json');
const SITEMAP_JSON = path.join(__dirname, '../../assets/parsed-sitemap.json');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getOrCreateClientFolder(auth, clientName) {
    const drive = google.drive({ version: 'v3', auth });
    const folderName = `Google Stacks ${clientName}`;

    const res = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
        spaces: 'drive'
    });

    if (res.data.files.length > 0) {
        console.log(`📂 Found existing folder: ${folderName}`);
        return res.data.files[0].id;
    }

    const folder = await drive.files.create({
        requestBody: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder'
        },
        fields: 'id'
    });

    console.log(`📁 Created new Drive folder: ${folderName}`);
    return folder.data.id;
}

async function generatePageContent(title, url) {
    const prompt = `Write a persuasive, SEO-friendly introductory paragraph for a web page titled "${title}". The URL is ${url}. Mention key benefits and invite the reader to explore more.`;

    try {
        console.log(`🤖 GPT generating content for: ${title}`);

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a skilled marketing copywriter.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        const content = response.choices[0].message.content;
        console.log(`🧠 GPT says: ${content.substring(0, 100)}...`);
        return content;
    } catch (err) {
        console.error(`❌ GPT error for "${title}":`, err.message || err);
        return `This is AI fallback content for ${url}`;
    }
}

async function createGoogleDoc(auth, page, folderId) {
    const docs = google.docs({ version: 'v1', auth });
    const drive = google.drive({ version: 'v3', auth });

    const search = await drive.files.list({
        q: `name='${page.title}' and '${folderId}' in parents and mimeType='application/vnd.google-apps.document' and trashed=false`,
        fields: 'files(id, name)'
    });

    if (search.data.files.length > 0) {
        const existing = search.data.files[0];
        const docUrl = `https://docs.google.com/document/d/${existing.id}/edit`;
        console.log(`♻️ Reusing existing doc: ${page.title} (${docUrl})`);
        return { ...page, docId: existing.id, docUrl };
    }

    const res = await docs.documents.create({
        requestBody: { title: page.title }
    });

    const docId = res.data.documentId;
    const docUrl = `https://docs.google.com/document/d/${docId}/edit`;

    await drive.files.update({
        fileId: docId,
        addParents: folderId,
        removeParents: 'root',
        fields: 'id, parents'
    });

    console.log(`📄 Created Doc: ${page.title} (${docUrl})`);

    const aiContent = await generatePageContent(page.title, page.url);

    await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
            requests: [
                {
                    insertText: {
                        location: { index: 1 },
                        text: `# ${page.title}\n\n${aiContent}\n`
                    }
                }
            ]
        }
    });

    return { ...page, docId, docUrl };
}

async function generateDocsForSitemap() {
    const auth = await authorize();
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH));
    const clientName = config.clientName || 'UnnamedClient';

    const folderId = await getOrCreateClientFolder(auth, clientName);
    const pages = JSON.parse(fs.readFileSync(SITEMAP_JSON));
    const enrichedPages = [];

    for (const page of pages) {
        const enriched = await createGoogleDoc(auth, page, folderId);
        enrichedPages.push(enriched);
    }

    const outputPath = path.join(__dirname, '../../assets/generated-docs.json');
    fs.writeFileSync(outputPath, JSON.stringify(enrichedPages, null, 2));
    console.log(`✅ Saved doc mapping to ${outputPath}`);
}

if (require.main === module) {
    generateDocsForSitemap();
}
