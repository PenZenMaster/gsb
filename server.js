
// Author: Skippy the Magnificent (with some help from G)
// Version: 1.00
// Date Modified: 04/07/2025 21:02
// Comment: Added /version endpoint to return server version

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_VERSION = "1.00";

app.use(express.json());

app.get("/version", (req, res) => {
  res.json({ version: SERVER_VERSION });
});

// Existing routes and logic here...
// e.g. app.get("/accounts", ...), app.post("/reauth/:email", ...)

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT} (v${SERVER_VERSION})`));
}
require("./server_patch")(app);
require("./auth_patch")(app);
require("./auth_callback_patch")(app);
require("./health_check_patch")(app);
require("./server_access_patch")(app);