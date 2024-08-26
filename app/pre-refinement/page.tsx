'use client';
import { useState, useEffect, FormEvent } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import socket from '@/app/socket';
import { useAuthContext } from '@/app/context/AuthContext';

import StoryList from '../components/StoryList';

type PreRefinement = {
  currentIndex: number;
  stories: PreStory[];
};

type PreStory = {
  name: string;
  link?: string;
};

const PreRefinement = () => {
  const { isAdmin } = useAuthContext();

  const [preRefinement, setPreRefinement] = useState<PreRefinement | null>({
    currentIndex: 0,
    stories: [
      {
        link: 'https://jira.censhare.com/browse/CSCPRDXX-1156',
        name: 'Refactor envoy filters (PO: Goa)',
      },
      {
        link: 'https://jira.censhare.com/browse/CSCPRDXX-829',
        name: 'No access to secrets (PO: Ziba)',
      },
      {
        link: 'https://jira.censhare.com/browse/CSCPRDXX-71',
        name: 'SPIKE: Evaluate transition of automation processes into censhare cloud (Tomas)',
      },
      {
        link: 'https://jira.censhare.com/browse/CSCPRDXX-1196',
        name: 'How should we deploy censhare core flows? (Tomas)',
      },
      {
        link: 'https://jira.censhare.com/browse/CSCPRDXX-57',
        name: 'PDF Preview web client - display double-page (PO: Vanessa)',
      },
      {
        link: 'update replica counts default to 0 for solution functions ',
        name: 'update replica counts default to 0 for solution functions (Gaurav)',
      },
      {
        link: 'CSCPRDXX-1242',
        name: 'Step 1: Change pipeline to call Vault to store secrets',
      },
      {
        link: 'CSCPRDXX-1243',
        name: 'Step 2: Write a library that access Vault secrets',
      },
      {
        link: 'CSCPRDXX-1244',
        name: 'Step 3: Identify and update all places where secrets used in our configuration',
      },
    ],
  });

  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(0);

  const storySelect = (index: number) => setSelectedStoryIndex(index);
  const deleteStory = () => socket.emit('deletePreStory', { index: preRefinement?.currentIndex });
  const addPreStory = (name: string, link: string) => {
    if (String(name).trim()) {
      socket.emit('addPreStory', { name: String(name).trim(), link });

      (document.getElementById('story-name') as HTMLInputElement).value = '';
      (document.getElementById('story-link') as HTMLInputElement).value = '';
    }
  };

  const handleReorder = (orderedPreStories: PreStory[], toIndex: number) => {
    if (isAdmin) {
      socket.emit('reorderPreStories', { preStories: orderedPreStories });
      storySelect(toIndex);
    }
  };

  const handleStorySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addPreStory(
      (document.getElementById('story-name') as HTMLInputElement).value,
      (document.getElementById('story-link') as HTMLInputElement).value
    );
  };

  useEffect(() => {
    socket.emit('getPreRefinement');

    socket.on('initPreRefinement', ({ preRefinement }) => {
      setPreRefinement(preRefinement);
    });

    socket.on('updatePreRefinement', (preRefinement) => {
      setPreRefinement(preRefinement);
      setSelectedStoryIndex(null);
    });

    return () => {
      socket.off('initPreRefinement');
      socket.off('updatePreRefinement');
    };
  }, []);

  return (
    <div className="flex flex-1">
      <div className="w-1/4 p-4 border-r">
        {isAdmin && (
          <div className="flex-1 mb-10">
            <div className="mt-4 ">
              <form onSubmit={handleStorySubmit}>
                <input
                  type="text"
                  placeholder="Story Name"
                  className="border p-2 mr-2 rounded w-full"
                  id="story-name"
                />
                <input
                  type="text"
                  placeholder="Story Link (optional)"
                  className="border p-2 mr-2 mt-2 mb-2 rounded w-full"
                  id="story-link"
                />
                <div className="flex justify-between">
                  <button type="submit" className=" bg-slate-600 text-white p-2 mr-2 rounded">
                    Create
                  </button>
                  <button onClick={deleteStory} className="bg-red-500 text-white p-2 rounded">
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="flex-4">
          <DndProvider backend={HTML5Backend}>
            <StoryList
              refinement={preRefinement}
              onStorySelect={storySelect}
              onReorder={handleReorder}
              currentIndex={selectedStoryIndex}
              noStyling
            />
          </DndProvider>
        </div>
      </div>
      <div className="flex w-1/4 p-4 border-r flex-col">
        <li className={`flex-2 mb-2 p-2 rounded flex border-red-600 border-2`}>
          <span className="text-lg text-gray-400 font-mono">Joker</span>
        </li>
        <li className={`flex-2 mb-2 p-2 rounded flex border-blue-600 border-2`}>
          <span className="text-lg text-gray-400 font-mono">Mercury</span>
        </li>
        <li className={`flex-2 mb-2 p-2 rounded flex border-yellow-600 border-2`}>
          <span className="text-lg text-gray-400 font-mono">Scooby-Doo</span>
        </li>
        <li className={`flex-2 mb-2 p-2 rounded flex border-green-600 border-2`}>
          <span className="text-lg text-gray-400 font-mono">Futurama</span>
        </li>
        <li className={`flex-2 mb-2 p-2 rounded flex border-white border-2`}>
          <span className="text-lg text-gray-400 font-mono">Octopus</span>
        </li>
      </div>
      <div className="w-1/4 p-4 border-r" style={{ flexBasis: '25%' }}></div>
    </div>
  );
};

export default PreRefinement;
