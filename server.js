// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let stories = [];
let votes = {};
let currentStoryIndex = 0;
let revealed = false;

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Send the initial state to the new client
  socket.emit('init', { stories, votes, currentStoryIndex, revealed });

  socket.on('addStory', (story) => {
    stories.push(story);
    io.emit('updateStories', stories);
  });

  socket.on('vote', ({ username, card }) => {
    votes[username] = card;
    io.emit('updateVotes', votes);
  });

  socket.on('revealVotes', () => {
    revealed = true;
    io.emit('updateRevealed', revealed);
  });

  socket.on('revote', () => {
    votes = {};
    revealed = false;
    io.emit('updateVotes', votes);
    io.emit('updateRevealed', revealed);
  });

  socket.on('nextStory', () => {
    if (currentStoryIndex < stories.length - 1) {
      currentStoryIndex += 1;
      votes = {};
      revealed = false;
      io.emit('updateCurrentStoryIndex', currentStoryIndex);
      io.emit('updateVotes', votes);
      io.emit('updateRevealed', revealed);
    }
  });

  socket.on('prevStory', () => {
    if (currentStoryIndex > 0) {
      currentStoryIndex -= 1;
      votes = {};
      revealed = false;
      io.emit('updateCurrentStoryIndex', currentStoryIndex);
      io.emit('updateVotes', votes);
      io.emit('updateRevealed', revealed);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
