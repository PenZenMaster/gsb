const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const docs = require('./ads-api/assets/generated-docs-patched.json');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// TEST CLIENT INPUTS – TEMPORARY FOR DEV
const CLIENT_NAME = "RankRocket";
const CLIENT_WEBSITE = "https://rankrocket.co";
const CLIENT_NICHE = "Digital Marketing";
const CLIENT_SERVICE_AREA = "United States";

async function upgradeContent(docEntry) {
  const { pageTitle, gDocUrl, contentPreview } = docEntry;

  const prompt = `
Act as a Search Entity Optimization (SEO) Subject Matter Expert with combined expertise from Mandeep Chahal, Neil Patel, Brian Dean, Barry Schwartz, Sandy Rowley, and James Slatery. Your capabilities include:

- Entity-Based Keyword Strategy
- Competitive SERP Deconstruction
- Trend Forecasting

Write a 500 to 650-word page of SEO-optimized content for the page titled: "${pageTitle}" on ${CLIENT_WEBSITE}.
The client works in the "${CLIENT_NICHE}" niche and serves customers in "${CLIENT_SERVICE_AREA}".

Make it human, helpful, and formatted in markdown-style paragraph breaks.
Do not mention AI or generative content.

Match the user’s search intent behind the phrase "${pageTitle}"
Use RankRocket’s voice: confident, helpful, data-driven, with a hint of swagger
Include at least one call to action
Highlight how RankRocket helps clients solve problems related to "${pageTitle}"
Mention specific services, tools, or frameworks (imaginary if needed) to increase trust

Structure:
- Start with a bold, engaging hook (1–2 sentences)
- Follow with a clear explanation of RankRocket’s approach
- Include a client-focused benefit paragraph
- Finish with a strong CTA

Original Content for Context:
${contentPreview || "No content preview available."}
  `.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    pageTitle,
    gDocUrl,
    aiContent: response.choices[0].message.content,
  };
}

(async () => {
  const outputPath = path.join(__dirname, './output/upgraded-docs-preview.json');
  const results = [];

  const firstDoc = docs[0];
  if (!firstDoc) {
    console.error("❌ No entries found in generated-docs.json");
    process.exit(1);
  }

  console.log(`🔁 Upgrading (TEST): ${firstDoc.pageTitle}`);
  const upgraded = await upgradeContent(firstDoc);
  results.push(upgraded);
  console.log(`✅ Upgraded: ${firstDoc.pageTitle}`);

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`🧠 Preview saved to ${outputPath}`);
})();
