const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory user store for demo
const accounts = [
  {
    name: "Bob Robertquilen",
    email: "brobertquilen@gmail.com",
    niche: "Rank Rocket",
    brand: "Rank Rocket",
    session: "storage/bob-login.json",
  },
  {
    name: "Adam Albertquif",
    email: "aalbertquif@gmail.com",
    niche: "Concrete",
    brand: "Concrete Kingz",
    session: "storage/adam-login.json",
  },
];

app.get("/accounts", (req, res) => {
  res.json(accounts);
});

app.post("/run-gpt", (req, res) => {
  const { email } = req.body;
  console.log(`[GPT] Generating content for ${email}`);
  res.json({ message: `Content generated for ${email}` });
});

app.post("/build-site", (req, res) => {
  const { email } = req.body;
  console.log(`[SiteBuilder] Launching builder for ${email}`);
  res.json({ message: `Site built for ${email}` });
});

app.post("/reauth", (req, res) => {
  const { email } = req.body;
  console.log(`[Reauth] Reauth requested for ${email}`);
  res.json({ message: `Reauthorized ${email}` });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});