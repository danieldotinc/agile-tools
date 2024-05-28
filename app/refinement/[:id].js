'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import socket from '@/app/socket';
import Link from 'next/link';

import PromptName from '../components/PromptName';
import StoryList from '../components/StoryList';
import VotingCards from '../components/VotingCards';
import UserCards from '../components/UserCards';

const admin = 'admin';

const Home = () => {
  const router = useRouter();
  const { id } = router.query;
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (savedName) {
      setUsername(savedName);
      setIsAdmin(savedName === admin);
      socket.emit('join', savedName);
    }

    socket.emit('initStories', { id });

    socket.on('initStories', ({ stories, currentStoryIndex, users }) => {
      setUsers(users);
      setStories(stories);
      setCurrentStoryIndex(currentStoryIndex);
    });

    socket.on('updateStories', (stories) => {
      setStories(stories);
    });

    socket.on('updateCurrentStoryIndex', (index) => {
      setCurrentStoryIndex(index);
    });

    socket.on('updateUsers', (users) => {
      setUsers(users);
    });

    return () => {
      socket.off('initStories');
      socket.off('updateUsers');
      socket.off('updateStories');
      socket.off('updateCurrentStoryIndex');
    };
  }, []);

  const handleNameSubmit = (name) => {
    setUsername(name);
    setIsAdmin(name === admin);
    localStorage.setItem('username', name);
    socket.emit('join', name);
  };

  const addStory = (name, link) => {
    if (String(name).trim()) {
      socket.emit('addStory', { name: String(name).trim(), link });
      document.getElementById('story-name').value = '';
      document.getElementById('story-link').value = '';
    }
  };

  const revote = () => socket.emit('revote');
  const nextStory = () => socket.emit('nextStory');
  const prevStory = () => socket.emit('prevStory');
  const revealVotes = () => socket.emit('revealVotes');
  const storySelect = (index) => socket.emit('storySelect', { index });
  const deleteStory = () => socket.emit('deleteStory', { currentStoryIndex });
  const handleVote = (card) => (!isAdmin ? socket.emit('vote', { username, card }) : null);

  const handleStorySubmit = (e) => {
    e.preventDefault();
    addStory(document.getElementById('story-name').value, document.getElementById('story-link').value);
  };

  return (
    <div className="flex flex-1">
      {!username && <PromptName onNameSubmit={handleNameSubmit} />}
      <StoryList
        stories={stories}
        currentStoryIndex={currentStoryIndex}
        onStorySelect={storySelect}
        isAdmin={isAdmin}
      />
      <div className="flex-1 flex flex-col p-4">
        {isAdmin && (
          <div className="flex-1 mb-4">
            <button onClick={prevStory} className="mr-2 bg-gray-400 text-white p-2 rounded">
              {'<'}
            </button>
            <button onClick={nextStory} className="mr-10 bg-gray-400 text-white p-2 rounded">
              {'>'}
            </button>

            <button onClick={revealVotes} className="mr-2 bg-prominent text-background p-2 rounded">
              Reveal
            </button>
            <button onClick={revote} className="mr-10 bg-cyan-600 text-white p-2 rounded">
              Revote
            </button>

            <button onClick={deleteStory} className="bg-red-500 text-white p-2 rounded">
              Delete
            </button>
            <div className="mt-4 flex w-3/4">
              <form onSubmit={handleStorySubmit}>
                <input
                  type="text"
                  placeholder="Story Name"
                  className="flex-2 border p-2 mr-2 rounded"
                  id="story-name"
                />
                <input
                  type="text"
                  placeholder="Story Link (optional)"
                  className="flex-2 border p-2 mr-2 rounded"
                  id="story-link"
                />
                <button type="submit" className=" bg-slate-600 text-white p-2 rounded">
                  Create
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-l font-mono mb-4 rounded bg-opposite text-white p-2 text-center m-6 mx-20">
            Current Story: {stories[currentStoryIndex]?.name || 'No story selected'}
            {!!stories[currentStoryIndex]?.link && (
              <span className="rounded-full bg-prominent p-1 mx-2 text-black text-xs">
                <Link href={stories[currentStoryIndex]?.link} target="_blank">
                  jira
                </Link>
              </span>
            )}
          </h1>
        </div>
        <div className="flex-4">
          {!!stories[currentStoryIndex] && (
            <UserCards users={users} stories={stories} currentIndex={currentStoryIndex} />
          )}
        </div>
        <div className="flex-1">
          {!!stories.length &&
            !isAdmin &&
            !stories[currentStoryIndex]?.revealed &&
            !stories[currentStoryIndex]?.result && (
              <VotingCards onVote={handleVote} story={stories[currentStoryIndex]} username={username} />
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;
