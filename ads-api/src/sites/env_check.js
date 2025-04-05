// File: ads-api/src/env_check.js
// Author: Skippy the Magnificent & George Penzenik
// Version: 1.00
// Date Modified: 00:40 04/05/2025
// Comment: Simple sanity check to confirm .env is loaded and OPENAI_API_KEY is set

require('dotenv').config();

if (!process.env.OPENAI_API_KEY) {
    console.error('🚨 ENV CHECK FAILED: OPENAI_API_KEY is missing or empty!');
    process.exit(1);
} else {
    console.log('✅ ENV CHECK PASSED: OPENAI_API_KEY is loaded and ready.');
}  
