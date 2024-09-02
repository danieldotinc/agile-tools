const { updateRefinement, updateUsers, deleteRefinement, fetchRefinements } = require('../repository/refinement');
const { updatePreRefinement, fetchPreRefinement } = require('../repository/pre-refinement');
const { fetchStories, fetchAllStories, updateStory, deleteStory } = require('../repository/story');

const generateRefinement = (id, name) => ({ id, name, stories: [], currentIndex: 0, users: [] });
const generateStory = ({ id, name, link, team, assigned, comments, refinementId }) => ({
  id,
  name,
  link,
  votes: {},
  revealed: false,
  result: null,
  comments,
  assigned,
  team,
  refinementId,
});

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
      if (refinement) io.emit('initRefinement', refinement);
    });

    socket.on('addRefinement', ({ name, id }) => {
      const refinement = generateRefinement(id, name);
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

    socket.on('deletePreRefStory', ({ story, preRefId }) => {
      const preRef = { ...preRefinement };
      const teamName = story.team || 'Stories';
      if (!preRef.teams[teamName] || preRefId !== preRef.id) return;

      const storyIndex = preRef.teams[teamName].findIndex((st) => st.id === story.id);
      if (storyIndex === -1) return;

      preRef.teams[teamName].splice(storyIndex, 1);

      io.emit('updatePreRefinement', preRef);
      updatePreRefinement(preRef);
      deleteStory(story.id);
    });

    socket.on('addStory', async (story) => {
      const { id, link, name, team, refinementId } = story;
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (refinement) {
        const generatedStory = generateStory({ id, name, link, team, refinementId });
        const createdStory = await updateStory(generatedStory);
        refinement.stories.push(createdStory);
        io.emit('updateRefinement', refinement);
        updateRefinement({ id: refinement.id, stories: refinement.stories });
      }
    });

    socket.on('addPreStory', async (preStory) => {
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

      const generatedStory = generateStory({ id: preStory.id, name: preStory.name, link: preStory.link });
      const createdStory = await updateStory(generatedStory);

      preRef.teams['Stories'].unshift(createdStory);

      io.emit('updatePreRefinement', preRef);
      updatePreRefinement(preRef);
    });

    socket.on('sendStoryToRefinement', async (story) => {
      const { id, name, link, team, assigned, comments, refinementId } = story;
      if (!team) return;

      const teamName = team.split('-')[0];
      refinements = await fetchRefinements();
      const refinementIndex = refinements.findIndex((ref) => ref.name.startsWith(teamName));

      const refinement =
        refinementIndex === -1
          ? generateRefinement(refinementId, `${teamName} Refinement`)
          : refinements[refinementIndex];

      const updatedStory = await updateStory({
        id,
        name,
        link,
        refinementId: refinement.id,
        team: teamName,
        assigned,
        comments,
      });

      refinement.stories.push(updatedStory);

      if (refinementIndex === -1) refinements.unshift(refinement);

      updateRefinement(refinement);

      preRefinement = await fetchPreRefinement();
      if (!preRefinement) return;

      const storyIndex = preRefinement.teams[team].findIndex((st) => st.id === id);
      preRefinement.teams[team].splice(storyIndex, 1);
      io.emit('updatePreRefinement', preRefinement);
      updatePreRefinement(preRefinement);
    });

    socket.on('vote', ({ refinementId, username, card }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (refinement) {
        refinement.stories[refinement.currentIndex].votes[username] = card;
        io.emit('updateRefinement', refinement);
        updateRefinement({ id: refinement.id, stories: refinement.stories });
      }
    });

    socket.on('updateTeams', ({ preRefId, teams }) => {
      if (preRefId !== preRefinement.id) return;

      const preRef = { id: preRefId, teams };
      io.emit('updatePreRefinement', preRef);
      updatePreRefinement(preRef);
    });

    socket.on('updateStory', (story) => {
      updateStory({ id: story.id, ...story });
    });

    socket.on('updateStories', ({ refinementId, stories }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (refinement) {
        refinement.stories = stories;
        io.emit('updateRefinement', refinement);
        updateRefinement({ id: refinementId, stories });
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

      let mostVotedValue = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));
      if (mostVotedValue === 'Pass' && Object.keys(voteCounts).length > 1) {
        delete voteCounts['Pass'];
        mostVotedValue = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));
      }

      refinement.stories[refinement.currentIndex].result = mostVotedValue;

      io.emit('updateRefinement', refinement);

      const votes = refinement.stories[refinement.currentIndex].votes;
      const storyId = refinement.stories[refinement.currentIndex].id;
      if (storyId) updateStory({ id: storyId, result: mostVotedValue, revealed: true, votes });
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

      const storyId = refinement.stories[refinement.currentIndex].id;
      if (storyId) updateStory({ id: storyId, result: null, revealed: false, votes: {} });
      updateRefinement({ id: refinement.id, stories: refinement.stories });
    });

    socket.on('deleteStory', ({ refinementId, story }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      const storyIndex = refinement.stories.findIndex((st) => st.id === story.id);
      if (storyIndex === -1) return;

      refinement.stories.splice(storyIndex, 1);
      refinement.currentIndex = storyIndex === 0 ? 0 : refinement.currentIndex - 1;

      io.emit('updateRefinement', refinement);
      if (story.id) deleteStory(story.id);
      updateRefinement({ id: refinement.id, stories: refinement.stories });
    });

    socket.on('storySelect', ({ refinementId, index }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      refinement.currentIndex = index;

      io.emit('updateRefinement', refinement);
      updateRefinement({ id: refinement.id, currentIndex: index });
    });

    socket.on('reorderStories', ({ refinementId, stories }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      refinement.stories = stories;

      io.emit('updateRefinement', refinement);
      updateRefinement({ id: refinement, stories: refinement.stories });
    });

    socket.on('nextStory', ({ refinementId }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      if (refinement.currentIndex < refinement.stories.length - 1) {
        refinement.currentIndex += 1;
        io.emit('updateRefinement', refinement);
        updateRefinement({ id: refinement.id, currentIndex });
      }
    });

    socket.on('prevStory', ({ refinementId }) => {
      const refinementIndex = refinements.findIndex((ref) => ref.id === refinementId);
      const refinement = refinements[refinementIndex];
      if (!refinement) return;

      if (refinement.currentIndex > 0) {
        refinement.currentIndex -= 1;
        io.emit('updateRefinement', refinement);
        updateRefinement({ id: refinement.id, currentIndex });
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
