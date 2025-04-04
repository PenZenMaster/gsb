const axios = require('axios');
const xml2js = require('xml2js');

async function parseSitemap(url) {
  const res = await axios.get(url);
  const parsed = await xml2js.parseStringPromise(res.data);
  return parsed.urlset.url.map(entry => entry.loc[0]);
}

module.exports = { parseSitemap };
