import express from "express";
import axios from "axios";

const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Inside your backend GitHub OAuth callback handler
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  
  // exchange code for token
  const tokenResponse = await axios.post(
    `https://github.com/login/oauth/access_token`,
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    },
    { headers: { Accept: "application/json" } }
  );

  const accessToken = tokenResponse.data.access_token;

  // redirect to frontend route with token in query
  const redirectURL =
    process.env.NODE_ENV === "production"
      ? `https://yourfrontend.onrender.com/auth/callback?token=${accessToken}`
      : `http://localhost:5173/auth/callback?token=${accessToken}`;

  res.redirect(redirectURL);
});

export default router;
