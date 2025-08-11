import express from "express";
import {testGemini, generateSummariesFromGitHub , generateTestCodeFromSummary } from "../controllers/ai.controller.js";

const router = express.Router();



router.get("/test-gemini", testGemini);
router.post("/github-summaries", generateSummariesFromGitHub);
router.post("/github-testcode", generateTestCodeFromSummary);

export default router;
