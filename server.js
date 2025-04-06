const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 🔐 OAuth Setup
const CLIENT_ID = "37156535763-79hajfra02dtocpef812lhg3fgakgfqi.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3001/auth/callback";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// 📦 Dynamic Account Loader
const storageDir = path.join(__dirname, "storage");

app.get("/accounts", (req, res) => {
  try {
    const files = fs.readdirSync(storageDir).filter(file => file.endsWith("-login.json"));
    const accounts = files.map(file => {
      const fullPath = path.join(storageDir, file);
      const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

      return {
        name: data.name || "Unknown",
        email: data.email,
        niche: data.niche || "Unknown Niche",
        brand: data.brand || "Unknown Brand",
        session: `storage/${file}`,
      };
    });
    res.json(accounts);
  } catch (err) {
    console.error("❌ Failed to load accounts:", err);
    res.status(500).send("Error loading accounts");
  }
});

// 🔄 Reauth (mock)
app.post("/reauth", (req, res) => {
  const { email } = req.body;
  console.log(`[Reauth] Reauth requested for ${email}`);
  res.json({ message: `Reauthorized ${email}` });
});

// ⚡ GPT Placeholder
app.post("/run-gpt", (req, res) => {
  const { email } = req.body;
  console.log(`[GPT] Generating content for ${email}`);
  res.json({ message: `Content generated for ${email}` });
});

// 🏗️ Site Builder Placeholder
app.post("/build-site", (req, res) => {
  const { email } = req.body;
  console.log(`[SiteBuilder] Launching builder for ${email}`);
  res.json({ message: `Site built for ${email}` });
});

// 🔑 Launch OAuth
app.get("/auth/start", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(authUrl);
});

// 🔁 OAuth Callback Handler
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const userinfo = await oauth2.userinfo.get();

    const email = userinfo.data.email;
    const sessionPath = `storage/${email.replace(/[@.]/g, "_")}-login.json`;

    const sessionData = {
      ...tokens,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      email: email,
      name: userinfo.data.name,
    };

    fs.writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
    console.log(`✅ New account session saved: ${sessionPath}`);
    res.send("✅ Account added! You can close this tab.");
  } catch (err) {
    console.error("❌ Auth error:", err);
    res.status(500).send("Authentication failed.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});