// File: ads-api/src/sites/sitemap_parser.js
// Author: Skippy the Magnificent & George Penzenik
// Version: 0.10 (Initial Sitemap Parser)
// Date Modified: 21:18 04/04/2025
// Comment: Parses XML sitemap and extracts URL structure and slugs

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

async function parseSitemap(xmlPath) {
  const xmlData = fs.readFileSync(xmlPath, 'utf-8');
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

  return pages;
}

if (require.main === module) {
  const testPath = path.join(__dirname, '../../assets/sitemap.xml');
  parseSitemap(testPath)
    .then(pages => {
      console.log('🧭 Sitemap structure extracted:');
      console.table(pages);
    })
    .catch(err => console.error('❌ Failed to parse sitemap:', err));
}

module.exports = { parseSitemap };
