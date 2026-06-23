// Load environment variables from .env file
require('dotenv').config();

// Import Express framework
const express = require('express');

// Import path module (for serving static files)
const path = require('path');

// Create Express app
const app = express();

// ---------- MIDDLEWARE (Processes requests before they reach routes) ----------

// 1. Parse JSON in request body (for POST /user)
app.use(express.json());

// 2. Serve static HTML files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// 3. BONUS: Custom middleware to log every request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware or route
});

// ---------- ROUTES (The actual API endpoints) ----------

// GET / -- Returns a simple message
app.get('/', (req, res) => {
    res.send('My Week 2 API!');
});

// POST /user -- Accepts {name, email} and responds with a greeting
app.post('/user', (req, res) => {
    // Extract name and email from request body
    const { name, email } = req.body;
    
    // ERROR HANDLING: Check if both fields exist
    if (!name || !email) {
        // 400 = Bad Request (client sent incomplete data)
        return res.status(400).json({
            error: 'Missing required fields: name and email are required'
        });
    }
    
    // Success! Send back a personalized greeting
    res.json({
        message: `Hello, ${name}!`,
        email: email,
        timestamp: new Date().toISOString()
    });
});

// GET /user/:id -- Returns user profile (simulated)
app.get('/user/:id', (req, res) => {
    // Extract the ID from the URL parameter
    const userId = req.params.id;
    
    // Check if ID is valid (must be a number)
    if (isNaN(userId)) {
        return res.status(400).json({
            error: 'User ID must be a number'
        });
    }
    
    // Send mock user data
    res.json({
        id: parseInt(userId),
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        profile: `User ${userId} profile`
    });
});

// ---------- START THE SERVER ----------

// Get port from .env or use 3000 as default
const PORT = process.env.PORT || 3000;

// Start listening for requests
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});