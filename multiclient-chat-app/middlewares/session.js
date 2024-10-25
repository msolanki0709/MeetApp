const session = require('express-session');

// Session middleware configuration
const sessionMiddleware = session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
});

module.exports = sessionMiddleware;

