const { updateRefinement, updateUsers, deleteRefinement, fetchRefinements } = require('../repository/refinement');
const { updatePreRefinement, fetchPreRefinement } = require('../repository/pre-refinement');

module.exports = async ({ io, server }) => {
  let refinements = await fetchRefinements();
  let preRefinement = await fetchPreRefinement();
  io.on('connection', (socket) => {
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

    socket.on('getRefinements', async () => {
      refinements = await fetchRefinements();
      if (refinements.length) io.emit('initRefinements', refinements);
    });

    socket.on('getPreRefinement', async () => {
      preRefinement = await fetchPreRefinement();
      if (preRefinement) io.emit('initPreRefinement', preRefinement);
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

    socket.on('deleteRefinement', (id) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === id);
      refinements.splice(refinementIndex, 1);
      io.emit('updateRefinements', refinements);
      deleteRefinement(id);
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

    socket.on('addPreStory', (preStory) => {
      const preRef = preRefinement ?? {
        id: preStory.preRefId,
        teams: {
          Stories: [],
          Joker: [],
          Mercury: [],
          ScoobyDoo: [],
          Futurama: [],
          Octopus: [],
          'Joker-P': [],
          'Mercury-P': [],
          'ScoobyDoo-P': [],
          'Futurama-P': [],
          'Octopus-P': [],
          'Joker-D': [],
          'Mercury-D': [],
          'ScoobyDoo-D': [],
          'Futurama-D': [],
          'Octopus-D': [],
        },
      };

      if (!preRef?.teams || !preRef.teams['Stories']) return;

      preRef.teams['Stories'].unshift({
        id: preStory.id,
        name: preStory.name,
        link: preStory.link,
      });

      io.emit('updatePreRefinement', preRef);
      updatePreRefinement(preRef);
    });

    socket.on('vote', ({ refinementId, username, card }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (refinement) {
        refinement.stories[refinement.currentIndex].votes[username] = card;
        io.emit('updateRefinement', refinement);
      }
    });

    socket.on('updateTeams', ({ preRefId, teams }) => {
      if (preRefId !== preRefinement.id) return;

      const preRef = { id: preRefId, teams };
      io.emit('updatePreRefinement', preRef);
      updatePreRefinement(preRef);
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

      let mostVotedValue = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));
      if (mostVotedValue === 'Pass' && Object.keys(voteCounts).length > 1) {
        delete voteCounts['Pass'];
        mostVotedValue = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));
      }

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

    socket.on('reorderStories', ({ refinementId, stories }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      refinement.stories = stories;

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
      }
      console.log('user disconnected', socket.id);
      io.emit('updateRefinements', refinements);
      updateUsers(refinements);
    });
  });

  return server;
};
