// health_check_patch.js
// Author: Skippy the Magnificent (with some help from G)
// Version: 1.00
// Date Modified: 04/07/2025 23:04
// Comment: Adds /health endpoint that checks for .env values, Google client validity, and other core sanity checks.

require("dotenv").config();
const { google } = require("googleapis");

module.exports = (app) => {
    app.get("/health", async (req, res) => {
        const report = {
            status: "OK",
            checks: [],
            errors: []
        };

        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
        const REDIRECT_URI = process.env.REDIRECT_URI;

        // ENV Checks
        if (!CLIENT_ID) {
            report.status = "FAIL";
            report.errors.push("Missing GOOGLE_CLIENT_ID in .env");
        } else {
            report.checks.push("✅ GOOGLE_CLIENT_ID loaded");
        }

        if (!CLIENT_SECRET) {
            report.status = "FAIL";
            report.errors.push("Missing GOOGLE_CLIENT_SECRET in .env");
        } else {
            report.checks.push("✅ GOOGLE_CLIENT_SECRET loaded");
        }

        if (!REDIRECT_URI) {
            report.status = "FAIL";
            report.errors.push("Missing REDIRECT_URI in .env");
        } else {
            report.checks.push("✅ REDIRECT_URI loaded: " + REDIRECT_URI);
        }

        try {
            const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: "offline",
                prompt: "consent",
                scope: ["https://www.googleapis.com/auth/userinfo.email"]
            });

            if (authUrl.includes("google.com")) {
                report.checks.push("✅ Auth URL generated successfully");
            } else {
                report.status = "FAIL";
                report.errors.push("Auth URL generation failed");
            }
        } catch (e) {
            report.status = "FAIL";
            report.errors.push("Error generating OAuth client or URL: " + e.message);
        }

        return res.json(report);
    });

    console.log("🩺 /health endpoint mounted and ready.");
};
