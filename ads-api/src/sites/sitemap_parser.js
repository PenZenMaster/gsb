// File: ads-api/src/sites/sitemap_parser.js
// Author: Skippy the Magnificent & George Penzenik
// Version: 0.30 (Supports Remote or Local Sitemap)
// Date Modified: 21:34 04/04/2025
// Comment: Can parse XML sitemap from local file OR remote URL

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function loadSitemapData(inputPath) {
    if (inputPath.startsWith('http://') || inputPath.startsWith('https://')) {
        console.log(`🌐 Fetching sitemap from URL: ${inputPath}`);
        const res = await fetch(inputPath);
        if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.statusText}`);
        const data = await res.text();
        fs.writeFileSync(path.join(__dirname, '../../assets/sitemap.xml'), data); // Cache copy locally
        return data;
    } else {
        console.log(`📄 Loading sitemap from file: ${inputPath}`);
        return fs.readFileSync(inputPath, 'utf-8');
    }
}

async function parseSitemap(inputPath, outputJsonPath = null) {
    const xmlData = await loadSitemapData(inputPath);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlData);

    if (!result.urlset || !result.urlset.url) {
        throw new Error('Invalid or empty sitemap');
    }

    const pages = result.urlset.url.map(entry => {
        const loc = entry.loc[0];
        const url = new URL(loc);
        const slug = url.pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
        const title = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Home';
        return {
            url: loc,
            slug: slug || 'home',
            title
        };
    });

    if (outputJsonPath) {
        fs.writeFileSync(outputJsonPath, JSON.stringify(pages, null, 2));
        console.log(`✅ Parsed sitemap saved to ${outputJsonPath}`);
    }

    return pages;
}

if (require.main === module) {
    const arg = process.argv[2];
    const inputPath = arg || path.join(__dirname, '../../assets/sitemap.xml');
    const outputPath = path.join(__dirname, '../../assets/parsed-sitemap.json');

    parseSitemap(inputPath, outputPath)
        .then(pages => {
            console.log('🧭 Sitemap structure extracted:');
            console.table(pages);
        })
        .catch(err => console.error('❌ Failed to parse sitemap:', err));
}

module.exports = { parseSitemap };
