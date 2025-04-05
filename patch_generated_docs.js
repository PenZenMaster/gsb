const fs = require('fs');
const path = require('path');

// Load the original generated-docs.json
const inputPath = path.join(__dirname, 'ads-api/assets/generated-docs.json');
const outputPath = path.join(__dirname, 'ads-api/assets/generated-docs-patched.json');

const raw = fs.readFileSync(inputPath);
const docs = JSON.parse(raw);

// Add contentPreview and pageTitle to each entry if missing
const patched = docs.map(doc => ({
  ...doc,
  pageTitle: doc.title || doc.slug || 'Untitled Page',
  contentPreview: doc.contentPreview || `This is placeholder content for \"${doc.title || doc.slug}\". Replace this with real GPT input or Google Doc text.`
}));

fs.writeFileSync(outputPath, JSON.stringify(patched, null, 2));
console.log(`✅ Patched ${patched.length} entries. Saved to ${outputPath}`);
