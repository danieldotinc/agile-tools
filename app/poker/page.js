'use client';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PromptName from '../components/PromptName';
import StoryList from '../components/StoryList';
import VotingCards from '../components/VotingCards';
import UserCards from '../components/UserCards';

const socket = io('http://localhost:3000');

const admin = 'admin'; // Change this to your desired admin identifier

const Home = () => {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (savedName) {
      setUsername(savedName);
      setIsAdmin(savedName === admin);
      socket.emit('join', savedName);
    }

    socket.on('init', ({ stories, currentStoryIndex, revealed, users }) => {
      setStories(stories);
      setCurrentStoryIndex(currentStoryIndex);
      setRevealed(revealed);
      setUsers(users);
    });

    socket.on('updateStories', stories => {
      setStories(stories);
    });

    socket.on('updateCurrentStoryIndex', index => {
      setCurrentStoryIndex(index);
    });

    socket.on('updateRevealed', revealed => {
      setRevealed(revealed);
    });

    socket.on('updateUsers', users => {
      setUsers(users);
    });

    socket.emit('getStories'); // Fetch stories when page loads

    return () => {
      socket.off('init');
      socket.off('updateStories');
      socket.off('updateCurrentStoryIndex');
      socket.off('updateRevealed');
      socket.off('updateUsers');
    };
  }, []);

  const handleNameSubmit = name => {
    setUsername(name);
    setIsAdmin(name === admin);
    localStorage.setItem('username', name);
    socket.emit('join', name);
  };

  const handleVote = card => {
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
    if (String(name).trim()) {
      socket.emit('addStory', { name: String(name).trim(), link });
      document.getElementById('story-name').value = '';
      document.getElementById('story-link').value = '';
    }
  };

  return (
    <div className="flex flex-1">
      {!username && <PromptName onNameSubmit={handleNameSubmit} />}
      <StoryList stories={stories} currentStoryIndex={currentStoryIndex} />
      <div className="flex-1 flex flex-col p-4">
        {isAdmin && (
          <div className="flex-1 mb-4">
            <button onClick={revealVotes} className="mr-2 bg-prominent text-background p-2 rounded">
              Reveal
            </button>
            <button onClick={revote} className="mr-2 bg-cyan-600 text-white p-2 rounded">
              Revote
            </button>
            <button onClick={prevStory} className="mr-2 bg-gray-400 text-white p-2 rounded">
              Prev
            </button>
            <button onClick={nextStory} className="bg-gray-400 text-white p-2 rounded">
              Next
            </button>
            <div className="mt-4">
              <input type="text" placeholder="Story Name" className="border p-2 mr-2" id="story-name" />
              <input type="text" placeholder="Story Link" className="border p-2 mr-2" id="story-link" />
              <button
                onClick={() =>
                  addStory(document.getElementById('story-name').value, document.getElementById('story-link').value)
                }
                className="bg-slate-600 text-white p-2 rounded"
              >
                Add Story
              </button>
            </div>
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-l font-mono mb-4 rounded bg-opposite text-white p-2 text-center m-6 mx-20">
            Current Story: {stories[currentStoryIndex]?.name || 'No story selected'}
          </h1>
        </div>
        <div className="flex-4">
          {!!stories[currentStoryIndex] && (
            <UserCards users={users} stories={stories} currentIndex={currentStoryIndex} revealed={revealed} />
          )}
        </div>
        <div className="flex-1">
          {!!stories.length && !isAdmin && !revealed && !stories[currentStoryIndex]?.result && (
            <VotingCards onVote={handleVote} story={stories[currentStoryIndex]} username={username} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
