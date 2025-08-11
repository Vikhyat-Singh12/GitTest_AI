import { aiAPI, AI_API_KEY, genAI } from "../config/ai.js";
import * as githubService from "../services/github.service.js";
import * as aiService from "../services/ai.service.js";
import { cleanAIOutput } from "../utils/formatters.js";


export const testGemini = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = "Write a simple Jest test case for a function that adds two numbers.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, output: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



export const generateSummariesFromGitHub = async (req, res) => {
  try {
    const { token, owner, repo, branch = "main", files } = req.body;
    // files = array of file paths selected by user

    // Fetch file contents concurrently
    const filesContent = await Promise.all(
      files.map(async (filePath) => {
        const content = await githubService.getFileContent({ token, owner, repo, path: filePath, branch });
        return { name: filePath, content };
      })
    );

    // Generate AI summaries
    const rawSummaries = await aiService.generateSummaries(filesContent);
    const summaries = Array.isArray(cleanAIOutput(rawSummaries))
    ? cleanAIOutput(rawSummaries)
    : [cleanAIOutput(rawSummaries)];



    res.json({ summaries });
  } catch (error) {
    console.error("Error in generateSummariesFromGitHub:", error);
    res.status(500).json({ error: error.message });
  }
};


export const generateTestCodeFromSummary = async (req, res) => {
  try {
    const { summary, framework = "Jest" } = req.body;

    if (!summary) {
      return res.status(400).json({ error: "Summary is required" });
    }

    const rawTestCode = await aiService.generateTestCode(summary, framework);
    const testCode = cleanAIOutput(rawTestCode);

    res.json({ testCode });
  } catch (error) {
    console.error("Error in generateTestCodeFromSummary:", error);
    res.status(500).json({ error: error.message });
  }
};