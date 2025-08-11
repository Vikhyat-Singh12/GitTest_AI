import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import githubRoutes from "./routes/github.route.js";
import aiRoutes from "./routes/ai.route.js";
import authRouter from "./routes/auth.route.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
const __dirname = path.resolve();


app.use(cors(
  {
    origin: 'http://localhost:5001',
    credentials: true
  }
));app.use(bodyParser.json());
app.use(express.json());

app.use("/api/auth",authRouter);
app.use("/api/github", githubRoutes);
app.use("/api/ai", aiRoutes);

if (process.env.NODE_ENV === 'production') {
  console.log('Production mode enabled');
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
  });
}



app.listen(PORT, () => {
  console.log(`✅ Server running on port http://localhost:${PORT}`);
});
