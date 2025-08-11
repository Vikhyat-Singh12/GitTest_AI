import { create } from "zustand";
import axios from '../lib/axios.js';
import { useAIStore } from "./useAIStore.js";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("github_token") || null,
  user: null,

  setToken: (token) => {
    localStorage.setItem("github_token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("github_token");
    sessionStorage.removeItem("ai-store");
    useAIStore.setState({ summaries: [], testCode: "" });

    set({ token: null, user: null });
  },

  fetchAccessToken: async (code) => {
    const res = await axios.post("/github/auth", { code });
    localStorage.setItem("github_token", res.data.access_token);
    set({ token: res.data.access_token });
  }
}));
