const express = require('express');
const path = require('path');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API route for contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }

  // Validate email format (simple regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email format.' });
  }

  try {
    await database.addMessage(name, email, message);
    res.status(200).json({ status: 'success', message: 'Message received! We\'ll be in touch soon.' });
  } catch (error) {
    console.error('Error saving message to database:', error);
    res.status(500).json({ status: 'error', message: 'Something went wrong. Please try again later.' });
  }
});

// Global error handler (optional, for unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Initialize database and start server
async function startServer() {
  try {
    await database.initDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Serving static files from:', path.join(__dirname, '..', 'public'));
    });
  } catch (error) {
    console.error('Failed to initialize database or start server:', error);
    process.exit(1); // Exit if critical setup fails
  }
}

startServer();
