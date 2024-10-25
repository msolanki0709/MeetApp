module.exports = function(socket, io) {
  const username = socket.request.session.username;

  if (username) {
    console.log(`${username} connected`);

    // Notify others when a user joins
    socket.broadcast.emit('message', `${username} has joined the chat`);

    // Handle chat message
    socket.on('chat message', (msg) => {
      io.emit('chat message', { user: username, message: msg });
    });

    // Notify others when a user leaves
    socket.on('disconnect', () => {
      io.emit('message', `${username} has left the chat`);
    });
  }
};

