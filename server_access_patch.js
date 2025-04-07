
// server_access_patch.js
// Author: Skippy the Magnificent (with some help from G)
// Version: 1.00
// Date Modified: 04/07/2025 23:45
// Comment: Adds CORS support for localhost:5173 and a placeholder /accounts route for frontend testing

const cors = require("cors");

module.exports = (app) => {
    // Enable CORS for frontend dev server
    app.use(cors({
        origin: "http://localhost:5173"
    }));

    // Temporary /accounts endpoint until token persistence is implemented
    app.get("/accounts", (req, res) => {
        res.json([
            { name: "Test Account", email: "test@example.com" }
        ]);
    });

    console.log("🔓 CORS enabled and /accounts route registered.");
};
