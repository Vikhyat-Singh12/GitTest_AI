import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios.js";

export const useAIStore = create(
  persist(
    (set) => ({
      summaries: [],
      testCode: "",

      generateSummaries: async ({ token, owner, repo, branch, files }) => {
        const res = await axios.post("/ai/github-summaries", {
          token, owner, repo, branch, files
        });
        console.log("Backend returned:", res.data);

        const newSummaries = Array.isArray(res.data.summaries)
          ? res.data.summaries
          : [res.data.summaries].filter(Boolean);

        set((state) => ({
          summaries: [...state.summaries, ...newSummaries]
        }));
      },

      generateTestCode: async (summary, framework = "Jest") => {
        const res = await axios.post("/ai/github-testcode", { summary, framework });
        set({ testCode: res.data.testCode });
      },
    }),
    {
      name: "ai-store", 
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({ summaries: state.summaries, testCode: state.testCode })
    }
  )
);
