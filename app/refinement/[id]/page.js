'use client';
import { useState, useEffect } from 'react';
import socket from '@/app/socket';
import Link from 'next/link';

import StoryList from '../../components/StoryList';
import VotingCards from '../../components/VotingCards';
import UserCards from '../../components/UserCards';

import { useAuthContext } from '@/app/context/AuthContext';

const Home = ({ params }) => {
  const { id } = params;
  const { username, isAdmin } = useAuthContext();

  const [refinement, setRefinement] = useState(null);

  useEffect(() => {
    socket.emit('getRefinement', { id });

    if (username) socket.emit('join', { username, refinementId: id });

    socket.on('initRefinement', ({ refinement }) => {
      setRefinement(refinement);
    });

    socket.on('updateRefinement', (refinement) => {
      setRefinement(refinement);
    });

    return () => {
      socket.off('initRefinement');
      socket.off('updateRefinement');
    };
  }, [username]);

  const addStory = (name, link) => {
    if (String(name).trim()) {
      socket.emit('addStory', { refinementId: id, name: String(name).trim(), link });
      document.getElementById('story-name').value = '';
      document.getElementById('story-link').value = '';
    }
  };

  const revote = () => socket.emit('revote', { refinementId: id });
  const prevStory = () => socket.emit('prevStory', { refinementId: id });
  const storySelect = (index) => socket.emit('storySelect', { refinementId: id, index });
  const nextStory = () => socket.emit('nextStory', { refinementId: id });
  const revealVotes = () => socket.emit('revealVotes', { refinementId: id });
  const deleteStory = () => socket.emit('deleteStory', { refinementId: id, index: refinement?.currentIndex });
  const handleVote = (card) => (!isAdmin ? socket.emit('vote', { refinementId: id, username, card }) : null);

  const handleStorySubmit = (e) => {
    e.preventDefault();
    addStory(document.getElementById('story-name').value, document.getElementById('story-link').value);
  };

  return (
    <div className="flex flex-1">
      <StoryList isAdmin={isAdmin} refinement={refinement} onStorySelect={storySelect} />
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
            Current Story: {refinement?.stories[refinement?.currentIndex]?.name || 'No story selected'}
            {!!refinement?.stories[refinement?.currentIndex]?.link && (
              <span className="rounded-full bg-prominent p-1 mx-2 text-black text-xs">
                <Link href={refinement?.stories[refinement?.currentIndex]?.link} target="_blank">
                  jira
                </Link>
              </span>
            )}
          </h1>
        </div>
        <div className="flex-4">
          {!!refinement?.stories[refinement?.currentIndex] && (
            <UserCards users={refinement.users} stories={refinement?.stories} currentIndex={refinement?.currentIndex} />
          )}
        </div>
        <div className="flex-1">
          {!!refinement?.stories.length &&
            !isAdmin &&
            !refinement?.stories[refinement?.currentIndex]?.revealed &&
            !refinement?.stories[refinement?.currentIndex]?.result && (
              <VotingCards
                onVote={handleVote}
                story={refinement?.stories[refinement?.currentIndex]}
                username={username}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;
