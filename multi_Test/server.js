const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
}));

// Store connected users
const users = {};

io.on('connection', (socket) => {
  let currentUser;

  socket.on('registerUser', (username) => {
    currentUser = username;
    users[username] = socket.id;
    io.emit('updateUserList', Object.keys(users)); // Update user list for all clients
  });

  socket.on('sendMessage', (msg, recipient) => {
    const message = `${currentUser}: ${msg}`;
    if (recipient && users[recipient]) {
      // Send message to the specific user
      socket.to(users[recipient]).emit('receiveMessage', message);
    } else {
      // Broadcast to all if recipient is not specified
      io.emit('receiveMessage', message);
    }
  });

  socket.on('disconnect', () => {
    delete users[currentUser];
    io.emit('updateUserList', Object.keys(users)); // Update user list for all clients
  });
});

// Use auth routes for handling login and registration


// Serve the index.ejs file for the root URL
app.get('/', (req, res) => {
  const username = req.session.username || 'Guest'; // Get username from session
  res.render('index', { username }); // Render index.ejs with username
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

