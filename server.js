// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let stories = [];
let users = [];
let currentStoryIndex = 0;
let revealed = false;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server);

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
    socket.emit('init', { stories, currentStoryIndex, revealed, users });

    socket.on('addStory', story => {
      stories.push({ name: story.name, link: story.link, votes: {}, result: null });
      io.emit('updateStories', stories);
    });

    socket.on('vote', ({ username, card }) => {
      stories[currentStoryIndex].votes[username] = card;
      io.emit('updateStories', stories);
    });

    socket.on('revealVotes', () => {
      revealed = true;

      // Calculate the most voted value for the current story
      const voteCounts = Object.values(stories[currentStoryIndex].votes).reduce((acc, vote) => {
        acc[vote] = (acc[vote] || 0) + 1;
        return acc;
      }, {});

      const mostVotedValue = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));

      stories[currentStoryIndex].result = mostVotedValue;

      io.emit('updateRevealed', revealed);
      io.emit('updateStories', stories);
    });

    socket.on('revote', () => {
      stories[currentStoryIndex].votes = {};
      revealed = false;
      stories[currentStoryIndex].result = null;
      io.emit('updateRevealed', revealed);
      io.emit('updateStories', stories);
    });

    socket.on('nextStory', () => {
      if (currentStoryIndex < stories.length - 1) {
        currentStoryIndex += 1;
        revealed = false;
        io.emit('updateCurrentStoryIndex', currentStoryIndex);
        io.emit('updateRevealed', revealed);
      }
    });

    socket.on('prevStory', () => {
      if (currentStoryIndex > 0) {
        currentStoryIndex -= 1;
        revealed = false;
        io.emit('updateCurrentStoryIndex', currentStoryIndex);
        io.emit('updateRevealed', revealed);
      }
    });

    socket.on('disconnect', () => {
      users = users.filter(user => user.id !== socket.id);
      io.emit('updateUsers', users);
      console.log('user disconnected', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
