const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let stories = [];
let votes = {};
let users = [];
let currentStoryIndex = 0;
let revealed = false;

io.on('connection', socket => {
  console.log('a user connected', socket.id);

  // Handle user joining
  socket.on('join', username => {
    if (!users.some(user => user.username === username)) {
      users.push({ id: socket.id, username });
      io.emit('updateUsers', users);
    }
  });

  // Send the initial state to the new client
  socket.emit('init', { stories, votes, currentStoryIndex, revealed, users });

  socket.on('addStory', story => {
    stories.push(story);
    io.emit('updateStories', stories);
  });

  socket.on('vote', ({ username, card }) => {
    votes[username] = card;
    io.emit('updateVotes', votes);
  });

  socket.on('revealVotes', () => {
    revealed = true;

    // Calculate the most voted value for the current story
    const voteCounts = Object.values(votes).reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {});

    const mostVotedValue = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));

    stories[currentStoryIndex].result = mostVotedValue;

    io.emit('updateRevealed', revealed);
    io.emit('updateStories', stories);
  });

  socket.on('revote', () => {
    votes = {};
    revealed = false;
    stories[currentStoryIndex].result = null;
    io.emit('updateVotes', votes);
    io.emit('updateRevealed', revealed);
    io.emit('updateStories', stories);
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
    users = users.filter(user => user.id !== socket.id);
    io.emit('updateUsers', users);
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
