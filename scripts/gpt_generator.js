const { Configuration, OpenAIApi } = require('openai');

async function generateContent(content, apiKey) {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const prompt = `You are an SEO expert. Rewrite the following content with the same intent but make it unique. Include a new page title, H1, and 2-3 paragraphs.\n\nTitle: ${content.title}\nH1: ${content.h1}\nContent:\n${content.paragraphs}`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    original: content,
    ai_output: response.data.choices[0].message.content,
  };
}

module.exports = { generateContent };
