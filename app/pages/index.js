"use client";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PromptName from '../components/PromptName';
import StoryList from '../components/StoryList';
import VotingCards from '../components/VotingCards';
import UserCards from '../components/UserCards';

const socket = io('http://localhost:3001');

const admin = 'admin'; // Change this to your desired admin identifier

const Home = () => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [users, setUsers] = useState([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (savedName) {
      setUsername(savedName);
      setIsAdmin(savedName === admin);
      socket.emit('join', savedName);
    }

    socket.on('init', ({ stories, votes, currentStoryIndex, revealed, users }) => {
      setStories(stories);
      setVotes(votes);
      setCurrentStoryIndex(currentStoryIndex);
      setRevealed(revealed);
      setUsers(users);
    });

    socket.on('updateStories', (stories) => {
      setStories(stories);
    });

    socket.on('updateVotes', (votes) => {
      setVotes(votes);
    });

    socket.on('updateCurrentStoryIndex', (index) => {
      setCurrentStoryIndex(index);
    });

    socket.on('updateRevealed', (revealed) => {
      setRevealed(revealed);
    });

    socket.on('updateUsers', (users) => {
      setUsers(users);
    });

    socket.emit('getStories'); // Fetch stories when page loads

    return () => {
      socket.off('init');
      socket.off('updateStories');
      socket.off('updateVotes');
      socket.off('updateCurrentStoryIndex');
      socket.off('updateRevealed');
      socket.off('updateUsers');
    };
  }, []);

  const handleNameSubmit = (name) => {
    setUsername(name);
    setIsAdmin(name === admin);
    localStorage.setItem('username', name);
    socket.emit('join', name);
  };

  const handleVote = (card) => {
    if (!isAdmin) {
      socket.emit('vote', { username, card });
    }
  };

  const revealVotes = () => {
    socket.emit('revealVotes');
  };

  const revote = () => {
    socket.emit('revote');
  };

  const nextStory = () => {
    socket.emit('nextStory');
  };

  const prevStory = () => {
    socket.emit('prevStory');
  };

  const addStory = (name, link) => {
    socket.emit('addStory', { name, link });
    document.getElementById('story-name').value = '';
    document.getElementById('story-link').value = '';
  };

  return (
    <div className="min-h-screen flex">
      {!username && <PromptName onNameSubmit={handleNameSubmit} />}
      <StoryList stories={stories} currentStoryIndex={currentStoryIndex} isAdmin={isAdmin} />
      <div className="flex-1 p-4">
        {isAdmin && (
          <div className="mb-4">
            <button onClick={revealVotes} className="mr-2 bg-green-500 text-white p-2 rounded">
              Reveal
            </button>
            <button onClick={revote} className="mr-2 bg-yellow-500 text-white p-2 rounded">
              Revote
            </button>
            <button onClick={prevStory} className="mr-2 bg-blue-500 text-white p-2 rounded">
              Prev
            </button>
            <button onClick={nextStory} className="bg-blue-500 text-white p-2 rounded">
              Next
            </button>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Story Name"
                className="border p-2 mr-2"
                id="story-name"
              />
              <input
                type="text"
                placeholder="Story Link"
                className="border p-2 mr-2"
                id="story-link"
              />
              <button
                onClick={() =>
                  addStory(
                    document.getElementById('story-name').value,
                    document.getElementById('story-link').value
                  )
                }
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Story
              </button>
            </div>
          </div>
        )}
        <h1 className="text-xl font-bold mb-4">
          Current Story: {stories[currentStoryIndex]?.name || 'No story selected'}
        </h1>
        <UserCards users={users} votes={votes} revealed={revealed} />
        {!isAdmin && !revealed && <VotingCards onVote={handleVote} />}
      </div>
    </div>
  );
};

export default Home;
