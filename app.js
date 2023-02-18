const path = require('path');
const http = require('http');

const express = require('express');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const formatMessage = require('./public/js/components/fortmatMessage.js');
const chatBot = 'Chat Bot';

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Tell express where to find static web files.
app.use(express.static('public'));

// Routes go here
// app.get is a route handler
// req : request
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/views/chat.html');
});

// socket.io stuff goes here
io.on('connection', socket => {
    console.log('A User Joined...');
    socket.emit('connected', { sID: socket.id, message: 'new connection' });
    
    // ChatBot Welcoming new user
    socket.emit('message', formatMessage(chatBot, 'Welcome to ChatCord!'));

    // Listen for new messages.
    socket.on('chat_message', function(msg) {
        console.log(msg);
        // io.emit('new_message', formatMessage(chatBot, { message: msg }));
        io.emit('message', formatMessage(chatBot, { message: msg }));
    });

    // Broadcast when a user connects with specific info - time, date...
    socket.broadcast.emit('message', formatMessage(chatBot, 'A user has joined the chat.'));

    // User typing
    socket.on('user_typing', function(user) {
        console.log(user);
        io.emit('typing', { currentlytyping: user });
    });

    // User left
    socket.on('disconnect', function(user) {
      console.log(user);
      io.emit('message', formatMessage(chatBot, 'A user has left the chat.'));
  });
});