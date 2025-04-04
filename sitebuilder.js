#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parseSitemap } = require('./scripts/sitemap_parser');
const { scrapeContent } = require('./scripts/html_scraper');
const { generateContent } = require('./scripts/gpt_generator');

const config = require('./config.json');

(async () => {
  try {
    const urls = await parseSitemap(config.sitemapUrl);
    console.log(`✔ Parsed ${urls.length} URLs from sitemap`);

    for (const url of urls) {
      console.log(`⏳ Scraping content from: ${url}`);
      const rawContent = await scrapeContent(url);

      console.log(`🤖 Generating content for: ${url}`);
      const aiContent = await generateContent(rawContent, config.openaiKey);

      const fileName = path.join(__dirname, 'output', encodeURIComponent(url) + '.json');
      fs.writeFileSync(fileName, JSON.stringify(aiContent, null, 2));
      console.log(`✅ Saved: ${fileName}`);
    }

    console.log("🎉 All done!");
  } catch (err) {
    console.error("❌ ERROR:", err);
  }
})();
