import { create } from "zustand";
import axios from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useGitHubStore = create((set) => ({
  repos: [],
  files: [],
  selectedRepo: null,
  selectedFiles: [],
  fileContent: "",
  loading: false,
  error: "",


  fetchRepos: async () => {
    const token = useAuthStore.getState().token; // ✅ get fresh token
    if (!token) return;
    const res = await axios.get(`/github/repos?token=${token}`);
    set({ repos: res.data });
  },

  fetchFiles: async (owner, repo) => {
    const token = useAuthStore.getState().token; // ✅ get fresh token
    if (!token) return;
    const res = await axios.get(`/github/files?token=${token}&owner=${owner}&repo=${repo}`);
    set({ files: res.data });
  },

  toggleFileSelection: (filePath) =>
    set((state) => {
      const exists = state.selectedFiles.includes(filePath);
      return {
        selectedFiles: exists
          ? state.selectedFiles.filter((f) => f !== filePath)
          : [...state.selectedFiles, filePath],
      };
    }),

    fetchFile: async (owner, repo, filePath, token) => {
    try {
      set({ loading: true, error: "", fileContent: "" });

      const res = await axios.get("/github/file-content", {
        params: {
          token,
          owner,
          repo,
          path: filePath,
          branch: "main", // change if needed
        },
      });

      set({ fileContent: res.data.content });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error loading file",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
