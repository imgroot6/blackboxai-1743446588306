const express = require('express');
const app = express();
const port = 8000;

// Serve static files
app.use(express.static('.'));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Access the app at http://localhost:${port}/6-digit-verification.html`);
});