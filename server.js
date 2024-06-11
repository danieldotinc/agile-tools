// server.js
const { createServer } = require('http');
const { parse } = require('url');
const env = require('dotenv');
const next = require('next');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const Refinement = require('./models/Refinement');

env.config();

const db = process.env.DATABASE_URI || 'url-not-found';
mongoose.connect(db).then(() => {
  console.log(`Connected to database...`);
});

let refinements = [];

const fetchRefinements = async () => {
  const result = await Refinement.find({});
  if (result.length) refinements = result;
};

const updateRefinement = async (refinement) => {
  console.log('updating refinement...');
  await Refinement.updateOne({ id: refinement.id }, { $set: { ...refinement } }, { upsert: true });
};

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  await fetchRefinements();

  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // Handle user joining
    socket.on('join', ({ username, refinementId }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      if (!refinement.users.some((user) => user.username === username)) {
        refinement.users.push({ id: socket.id, username });
        io.emit('updateRefinement', refinement);
        updateRefinement({ id: refinement.id, users: refinement.users });
      }
    });

    socket.on('getRefinements', () => {
      io.emit('initRefinements', refinements);
    });

    socket.on('getRefinement', ({ id }) => {
      const refinement = refinements.find((ref) => ref.id === id);
      if (refinement) io.emit('initRefinement', { refinement });
    });

    socket.on('addRefinement', ({ name, id }) => {
      const refinement = { name, id, stories: [], currentIndex: 0, users: [] };
      refinements.unshift(refinement);
      io.emit('updateRefinements', refinements);
      updateRefinement(refinement);
    });

    socket.on('addStory', (story) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === story.refinementId);
      const refinement = refinements[refinementIndex];
      if (refinement) {
        refinement.stories.push({
          name: story.name,
          link: story.link,
          votes: {},
          revealed: false,
          result: null,
        });
        io.emit('updateRefinement', refinement);
        updateRefinement({ id: refinement.id, stories: refinement.stories });
      }
    });

    socket.on('vote', ({ refinementId, username, card }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (refinement) {
        refinement.stories[refinement.currentIndex].votes[username] = card;
        io.emit('updateRefinement', refinement);
      }
    });

    socket.on('revealVotes', ({ refinementId }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;
      refinement.stories[refinement.currentIndex].revealed = true;

      // Calculate the most voted value for the current story
      const voteCounts = Object.values(refinement.stories[refinement.currentIndex].votes).reduce((acc, vote) => {
        acc[vote] = (acc[vote] || 0) + 1;
        return acc;
      }, {});

      const mostVotedValue = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));
      refinement.stories[refinement.currentIndex].result = mostVotedValue;

      io.emit('updateRefinement', refinement);
      updateRefinement({ id: refinement.id, stories: refinement.stories });
    });

    socket.on('revote', ({ refinementId }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      refinement.stories[refinement.currentIndex].votes = {};
      refinement.stories[refinement.currentIndex].result = null;
      refinement.stories[refinement.currentIndex].revealed = false;

      io.emit('updateRefinement', refinement);
      updateRefinement({ id: refinement.id, stories: refinement.stories });
    });

    socket.on('deleteStory', ({ refinementId, index }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      refinement.stories.splice(index, 1);
      refinement.currentIndex = index === 0 ? 0 : refinement.currentIndex - 1;

      io.emit('updateRefinement', refinement);
      updateRefinement({ id: refinement.id, stories: refinement.stories });
    });

    socket.on('storySelect', ({ refinementId, index }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      refinement.currentIndex = index;

      io.emit('updateRefinement', refinement);
    });

    socket.on('nextStory', ({ refinementId }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      if (refinement.currentIndex < refinement.stories.length - 1) {
        refinement.currentIndex += 1;
        io.emit('updateRefinement', refinement);
      }
    });

    socket.on('prevStory', ({ refinementId }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      if (refinement.currentIndex > 0) {
        refinement.currentIndex -= 1;
        io.emit('updateRefinement', refinement);
      }
    });

    socket.on('disconnect', () => {
      for (let refinement of refinements) {
        refinement.users = refinement.users.filter((user) => user.id !== socket.id);
        io.emit('updateRefinements', refinements);
        console.log('user disconnected', socket.id);
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
