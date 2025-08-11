import express from "express";
import {
  getUserRepos,
  getRepoFiles,
  getFileContent
} from "../controllers/github.controller.js";

const router = express.Router();

router.get("/repos", getUserRepos);
router.get("/files", getRepoFiles);
router.get('/file-content', getFileContent);

export default router;
