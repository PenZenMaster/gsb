
// server_patch.js
// Author: Skippy the Magnificent (with some help from G)
// Version: 1.00
// Date Modified: 04/07/2025 21:20
// Comment: Modular patch for server.js — Adds version endpoint without affecting existing routes or config.

module.exports = (app) => {
    const SERVER_VERSION = "1.00";

    app.get("/version", (req, res) => {
        res.json({ version: SERVER_VERSION });
    });

    console.log("✅ Version endpoint mounted (v" + SERVER_VERSION + ")");
};
