import { githubAPI } from "../config/github.js";


export const getRepoCodeFiles = async ({ token, owner, repo, branch = "main" }) => {
  const treeResponse = await githubAPI.get(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: { Authorization: `token ${token}` } }
  );
  // Filter code files
  return treeResponse.data.tree.filter(file =>
    /\.(js|jsx|ts|tsx|py|java|cpp)$/.test(file.path)
  );
};


export const getFileContent = async ({ token, owner, repo, path, branch = "main" }) => {
  const contentResponse = await githubAPI.get(
    `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: { Authorization: `token ${token}` } }
  );
  const { content, encoding } = contentResponse.data;
  if (encoding === "base64") {
    return Buffer.from(content, "base64").toString("utf-8");
  }
  throw new Error("Unknown file encoding");
};
