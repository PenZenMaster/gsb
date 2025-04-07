
// auth_callback_patch.js
// Author: Skippy the Magnificent (with some help from G)
// Version: 1.00
// Date Modified: 04/07/2025 22:08
// Comment: Handles Google OAuth2 callback, exchanges code for tokens, logs user info

require("dotenv").config();
const { google } = require("googleapis");

module.exports = (app) => {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/auth/callback";

    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    app.get("/auth/callback", async (req, res) => {
        const code = req.query.code;

        if (!code) {
            return res.status(400).send("Missing code parameter.");
        }

        try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            const oauth2 = google.oauth2({
                auth: oauth2Client,
                version: "v2"
            });

            const userInfo = await oauth2.userinfo.get();
            const { email, name } = userInfo.data;

            console.log("✅ Google Account Authenticated:");
            console.log("   👤 Name:", name);
            console.log("   📧 Email:", email);
            console.log("   🔑 Access Token:", tokens.access_token);
            console.log("   🔄 Refresh Token:", tokens.refresh_token);

            res.send(`✅ Welcome ${name} (${email})! You may now return to the app.`);
        } catch (error) {
            console.error("❌ Error exchanging code for tokens:", error);
            res.status(500).send("Authentication failed.");
        }
    });
};
