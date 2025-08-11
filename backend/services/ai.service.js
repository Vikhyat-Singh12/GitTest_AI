import { aiAPI, AI_API_KEY } from "../config/ai.js";


export const generateSummaries = async (filesContent) => {
  const prompt = `
You are a testing expert. Given the following code files:
${filesContent.map(f => `File: ${f.name}\nContent:\n${f.content}`).join("\n\n")}
Generate a short list of possible test cases (1-2 line summaries) for each file.
`;

  const response = await aiAPI.post(
    `/models/gemini-2.0-flash:generateContent?key=${AI_API_KEY}`,
    { contents: [{ parts: [{ text: prompt }] }] }
  );
  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};


export const generateTestCode = async (summary, framework = "Jest") => {
  const prompt = `
Write a full ${framework} test case based on this summary:
${summary}
`;

  const response = await aiAPI.post(
    `/models/gemini-2.0-flash:generateContent?key=${AI_API_KEY}`,
    { contents: [{ parts: [{ text: prompt }] }] }
  );
  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};
