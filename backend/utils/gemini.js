const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Call Gemini 2.5 Flash-Lite (FREE tier: 1000 req/day, 15 RPM)
 * Falls back gracefully if API key is missing.
 */
const callGemini = async (systemPrompt, userPrompt) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_gemini')) {
    throw new Error('GEMINI_API_KEY is not set. Get your free key at https://aistudio.google.com/apikey');
  }

  // Use gemini-2.5-flash-lite — best free tier model (1000 req/day)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite-preview-06-17',
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  return text;
};

/**
 * Call Gemini and parse JSON response safely
 */
const callGeminiJSON = async (systemPrompt, userPrompt) => {
  const raw = await callGemini(
    systemPrompt + '\n\nCRITICAL: Return ONLY valid JSON. No markdown, no backticks, no explanation. Raw JSON only.',
    userPrompt
  );

  // Strip markdown code fences if model adds them anyway
  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Return raw text wrapped in a simple object as fallback
    return { raw: cleaned };
  }
};

module.exports = { callGemini, callGeminiJSON };
