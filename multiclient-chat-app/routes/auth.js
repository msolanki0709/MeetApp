const express = require('express');
const path = require('path');  // To resolve the HTML file paths
const bcrypt = require('bcryptjs');
const router = express.Router();

const users = []; // In-memory user store for demo purposes

// Serve the registration page
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

// Handle registration form submission
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.redirect('/login');
});

// Serve the login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Handle login form submission
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.username = username;
    res.redirect('/');
  } else {
    res.send('Login failed');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;

