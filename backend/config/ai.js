import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export const aiAPI = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  headers: { "Content-Type": "application/json" }
});

export const AI_API_KEY = process.env.AI_API_KEY;

export const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
