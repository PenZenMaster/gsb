
// auth_patch.js
// Author: Skippy the Magnificent (with some help from G)
// Version: 1.00
// Date Modified: 04/07/2025 21:40
// Comment: Adds /add-account route using googleapis to initiate OAuth login

require("dotenv").config();
const { google } = require("googleapis");

module.exports = (app) => {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/oauth2callback";

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.warn("⚠️ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env file.");
        return;
    }

    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    const SCOPES = [
        "https://www.googleapis.com/auth/siteverification",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/documents",
        "https://www.googleapis.com/auth/presentations",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.rosters.readonly",
        "https://sites.googleapis.com/auth/sites"
    ];

    app.get("/add-account", (req, res) => {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: SCOPES
        });

        console.log("🔗 Generated Google OAuth URL for account addition.");
        res.json({ authUrl });
    });
};
