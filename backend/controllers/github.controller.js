import { githubAPI} from "../config/github.js";
import axios from "axios";


export const getUserRepos = async (req, res) => {
  try {
    const { token } = req.query;

    const repos = await githubAPI.get("/user/repos", {
      headers: { Authorization: `token ${token}` }
    });

    res.json(repos.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getRepoFiles = async (req, res) => {
  try {
    const { token, owner, repo, branch = "main" } = req.query;

    // Get file tree from GitHub
    const treeResponse = await githubAPI.get(
      `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers: { Authorization: `token ${token}` } }
    );

    // Filter only code files (js, py, ts, java, etc.)
    const codeFiles = treeResponse.data.tree.filter(file =>
      /\.(js|jsx|ts|tsx|py|java|cpp)$/.test(file.path)
    );

    res.json(codeFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getFileContent = async (req, res) => {
  const { token, owner, repo, path, branch } = req.query;

  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    console.log("Fetching from:", apiUrl);

    const response = await axios.get(apiUrl, {
      headers: { Authorization: `token ${token}` },
    });

    const content = Buffer.from(response.data.content, "base64").toString("utf-8");
    res.json({ content });
  } catch (err) {
    console.error("GitHub API error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "Error fetching file content",
      details: err.response?.data || err.message,
    });
  }
}
