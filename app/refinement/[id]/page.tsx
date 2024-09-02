'use client';
import { useState, useEffect, FormEvent } from 'react';
import { nanoid } from 'nanoid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import socket from '@/app/socket';
import Link from 'next/link';

import StoryList from '../../components/StoryList';
import StoryDetails from '../../components/StoryDetails';
import VotingCards from '../../components/VotingCards';
import UserCards from '../../components/UserCards';

import { useAuthContext } from '@/app/context/AuthContext';
import { useRefinement } from '@/app/store/refinement';
import { Story } from '@/app/store/story';

type Props = {
  params: { id: string };
};

const Home = ({ params }: Props) => {
  const { id } = params;
  const { username, isAdmin } = useAuthContext();
  const [isStoryDetailVisible, setStoryDetailVisibility] = useState(false);
  const [userChangedIndex, setUserChangedIndex] = useState<number | null>(null);

  const [setRefinement, updateStory] = useRefinement((state) => [state.setRefinement, state.updateStory]);
  const [stories, currentIndex] = useRefinement((state) => [state.stories, state.currentIndex]);
  const [selectedStory, setSelectedStory] = useRefinement((state) => [state.selectedStory, state.setDetailedStory]);

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

  const addStory = (name: string, link: string) => {
    if (String(name).trim()) {
      socket.emit('addStory', { id: nanoid(10), name: String(name).trim(), link, refinementId: id });
      (document.getElementById('story-name') as HTMLInputElement).value = '';
      (document.getElementById('story-link') as HTMLInputElement).value = '';
    }
  };

  const revote = () => socket.emit('revote', { refinementId: id });
  const prevStory = () => socket.emit('prevStory', { refinementId: id });
  const storySelect = (index: number) => {
    if (isAdmin) socket.emit('storySelect', { refinementId: id, index });
    else if (index !== currentIndex) setUserChangedIndex(index);
    else setUserChangedIndex(null);
  };
  const nextStory = () => socket.emit('nextStory', { refinementId: id });
  const revealVotes = () => socket.emit('revealVotes', { refinementId: id });
  const deleteStory = () => socket.emit('deleteStory', { refinementId: id, index: currentIndex });
  const handleVote = (card: string) => (!isAdmin ? socket.emit('vote', { refinementId: id, username, card }) : null);

  const handleReorder = (orderedStories: Story[], toIndex: number) => {
    if (isAdmin) {
      socket.emit('reorderStories', { refinementId: id, stories: orderedStories });
      storySelect(toIndex);
    }
  };

  const handleStorySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addStory(
      (document.getElementById('story-name') as HTMLInputElement).value,
      (document.getElementById('story-link') as HTMLInputElement).value
    );
  };

  const handleStoryDetailsView = (story: Story, index: number) => {
    if (!isStoryDetailVisible) setSelectedStory({ ...story, index });
    else setSelectedStory(undefined);

    setStoryDetailVisibility(!isStoryDetailVisible);
  };

  const handleUpdateStory = (story: Story) => {
    setSelectedStory(story);
    updateStory(story);
  };

  const currentIdx = userChangedIndex ?? currentIndex ?? 0;

  return (
    <>
      {isStoryDetailVisible && !!selectedStory && (
        <StoryDetails
          story={selectedStory}
          onStoryUpdate={handleUpdateStory}
          onClose={() => handleStoryDetailsView(selectedStory, 0)}
        />
      )}

      <div className="flex flex-1">
        <DndProvider backend={HTML5Backend}>
          <StoryList
            onDetailView={handleStoryDetailsView}
            onStorySelect={storySelect}
            onReorder={handleReorder}
            currentIndex={currentIdx}
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
              Story: {stories[currentIdx]?.name || 'No story selected'}
              {!!stories[currentIdx]?.link && (
                <span className="rounded-full bg-prominent p-1 mx-2 text-black text-xs">
                  <Link href={stories[currentIdx]?.link} target="_blank">
                    jira
                  </Link>
                </span>
              )}
            </h1>
          </div>
          <div className="flex-4">{!!stories[currentIdx] && <UserCards currentIndex={currentIdx} />}</div>
          <div className="flex-1">
            {!!stories.length &&
              !isAdmin &&
              userChangedIndex === null &&
              !stories[currentIdx]?.revealed &&
              !stories[currentIdx]?.result && (
                <VotingCards onVote={handleVote} story={stories[currentIdx]} username={username} />
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
