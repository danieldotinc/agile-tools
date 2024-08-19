'use client';
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
  const [userChangedIndex, setUserChangedIndex] = useState(null);

  useEffect(() => {
    socket.emit('getRefinement', { id });

    if (username) socket.emit('join', { username, refinementId: id });

    socket.on('initRefinement', ({ refinement }) => {
      setRefinement(refinement);
    });

    socket.on('updateRefinement', (refinement) => {
      setRefinement(refinement);
      setUserChangedIndex(null);
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
  const storySelect = (index) => {
    if (isAdmin) socket.emit('storySelect', { refinementId: id, index });
    else if (index !== refinement.currentIndex) setUserChangedIndex(index);
    else setUserChangedIndex(null);
  };
  const nextStory = () => socket.emit('nextStory', { refinementId: id });
  const revealVotes = () => socket.emit('revealVotes', { refinementId: id });
  const deleteStory = () => socket.emit('deleteStory', { refinementId: id, index: refinement?.currentIndex });
  const handleVote = (card) => (!isAdmin ? socket.emit('vote', { refinementId: id, username, card }) : null);

  const handleReorder = (orderedStories, toIndex) => {
    if (isAdmin) {
      socket.emit('reorderStories', { refinementId: id, stories: orderedStories });
      storySelect(toIndex);
    }
  };

  const handleStorySubmit = (e) => {
    e.preventDefault();
    addStory(document.getElementById('story-name').value, document.getElementById('story-link').value);
  };

  const currentIndex = userChangedIndex ?? refinement?.currentIndex;

  return (
    <div className="flex flex-1">
      <DndProvider backend={HTML5Backend}>
        <StoryList
          refinement={refinement}
          onStorySelect={storySelect}
          onReorder={handleReorder}
          currentIndex={currentIndex}
        />
      </DndProvider>
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
            Story: {refinement?.stories[currentIndex]?.name || 'No story selected'}
            {!!refinement?.stories[currentIndex]?.link && (
              <span className="rounded-full bg-prominent p-1 mx-2 text-black text-xs">
                <Link href={refinement?.stories[currentIndex]?.link} target="_blank">
                  jira
                </Link>
              </span>
            )}
          </h1>
        </div>
        <div className="flex-4">
          {!!refinement?.stories[currentIndex] && (
            <UserCards users={refinement.users} stories={refinement?.stories} currentIndex={currentIndex} />
          )}
        </div>
        <div className="flex-1">
          {!!refinement?.stories.length &&
            !isAdmin &&
            userChangedIndex === null &&
            !refinement?.stories[currentIndex]?.revealed &&
            !refinement?.stories[currentIndex]?.result && (
              <VotingCards onVote={handleVote} story={refinement?.stories[currentIndex]} username={username} />
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;
