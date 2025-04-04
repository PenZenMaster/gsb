const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeContent(url) {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  
  const title = $('title').text();
  const h1 = $('h1').first().text();
  const paragraphs = $('p').map((i, el) => $(el).text()).get().slice(0, 5).join('\n');

  return { url, title, h1, paragraphs };
}

module.exports = { scrapeContent };
