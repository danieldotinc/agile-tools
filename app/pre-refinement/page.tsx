'use client';
import { useState, useEffect } from 'react';
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd';

import socket from '@/app/socket';
import { useAuthContext } from '@/app/context/AuthContext';

import StoryBuckets, { Buckets, PreStory } from './StoryBuckets';

type PreRefinement = {
  currentIndex: number;
  stories: PreStory[];
};

const PreRefinement = () => {
  const { isAdmin } = useAuthContext();

  const [buckets, setBuckets] = useState<Buckets>({
    Stories: [
      {
        id: 'a',
        link: 'https://jira.censhare.com/browse/CSCPRDXX-1156',
        name: 'Refactor envoy filters (PO: Goa)',
      },
      {
        id: 'b',
        link: 'https://jira.censhare.com/browse/CSCPRDXX-829',
        name: 'No access to secrets (PO: Ziba)',
      },
      {
        id: 'c',
        link: 'https://jira.censhare.com/browse/CSCPRDXX-71',
        name: 'SPIKE: Evaluate transition of automation processes into censhare cloud (Tomas)',
      },
      {
        id: 'd',
        link: 'https://jira.censhare.com/browse/CSCPRDXX-1196',
        name: 'How should we deploy censhare core flows? (Tomas)',
      },
      {
        id: 'e',
        link: 'https://jira.censhare.com/browse/CSCPRDXX-57',
        name: 'PDF Preview web client - display double-page (PO: Vanessa)',
      },
      {
        id: 'f',
        link: 'update replica counts default to 0 for solution functions ',
        name: 'update replica counts default to 0 for solution functions (Gaurav)',
      },
    ],
    Joker: [
      {
        id: 'g',
        link: 'CSCPRDXX-1242',
        name: 'Step 1: Change pipeline to call Vault to store secrets',
      },
      {
        id: 'h',
        link: 'CSCPRDXX-1243',
        name: 'Step 2: Write a library that access Vault secrets',
      },
      {
        id: 'i',
        link: 'CSCPRDXX-1244',
        name: 'Step 3: Identify and update all places where secrets used in our configuration',
      },
    ],
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
  });

  const reorder = (list: PreStory[], startIndex: number, endIndex: number): PreStory[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(buckets[source.droppableId], source.index, destination.index);
      setBuckets((prev) => ({
        ...prev,
        [source.droppableId]: items,
      }));
    } else {
      const sourceClone = Array.from(buckets[source.droppableId]);
      const destClone = Array.from(buckets[destination.droppableId]);
      const [removed] = sourceClone.splice(source.index, 1);

      destClone.splice(destination.index, 0, removed);

      setBuckets((prev) => ({
        ...prev,
        [source.droppableId]: sourceClone,
        [destination.droppableId]: destClone,
      }));
    }
  };

  const filterTeamBuckets = () => ({
    Stories: [...(buckets.Stories ?? [])],
  });

  const getReadyBuckets = () => ({
    Joker: [...(buckets.Joker ?? [])],
    Mercury: [...(buckets.Mercury ?? [])],
    ScoobyDoo: [...(buckets.ScoobyDoo ?? [])],
    Futurama: [...(buckets.Futurama ?? [])],
    Octopus: [...(buckets.Octopus ?? [])],
  });

  const getProgressBuckets = () => ({
    'Joker-P': [...(buckets['Joker-P'] ?? [])],
    'Mercury-P': [...(buckets['Mercury-P'] ?? [])],
    'ScoobyDoo-P': [...(buckets['ScoobyDoo-P'] ?? [])],
    'Futurama-P': [...(buckets['Futurama-P'] ?? [])],
    'Octopus-P': [...(buckets['Octopus-P'] ?? [])],
  });

  const getDoneBuckets = () => ({
    'Joker-D': [...(buckets['Joker-D'] ?? [])],
    'Mercury-D': [...(buckets['Mercury-D'] ?? [])],
    'ScoobyDoo-D': [...(buckets['ScoobyDoo-D'] ?? [])],
    'Futurama-D': [...(buckets['Futurama-D'] ?? [])],
    'Octopus-D': [...(buckets['Octopus-D'] ?? [])],
  });

  useEffect(() => {
    socket.emit('getPreRefinement');

    socket.on('initPreRefinement', ({ preRefinement }) => {
      setBuckets((prev) => ({
        ...prev,
        Stories: preRefinement.stories,
      }));
    });

    socket.on('updatePreRefinement', (preRefinement) => {
      setBuckets((prev) => ({
        ...prev,
        Stories: preRefinement.stories,
      }));
    });

    return () => {
      socket.off('initPreRefinement');
      socket.off('updatePreRefinement');
    };
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-1">
        <div className="w-1/4 p-4 border-r">
          {isAdmin && (
            <div className="flex-1 mb-10">
              <div className="mt-4 ">
                <form>
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
                    <button className="bg-red-500 text-white p-2 rounded">Delete</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <StoryBuckets buckets={filterTeamBuckets()} />
        </div>
        <div className="flex w-1/4 p-4 border-r flex-col">
          <div className="flex justify-center text-xl font-mono font-semibold mb-10 pb-2 border-y-2 border-t-0 border-b-prominent">
            <span className="text-red-400 mr-2">Ready</span>for Pre-Refinement
          </div>
          <StoryBuckets buckets={getReadyBuckets()} />
        </div>
        <div className="flex w-1/4 p-4 border-r flex-col">
          <div className="flex justify-center text-xl font-mono font-semibold mb-10 pb-2 border-y-2 border-t-0 border-b-prominent">
            Pre-Refinement <span className="text-blue-400 ml-2"> In-Progress</span>
          </div>
          <StoryBuckets buckets={getProgressBuckets()} />
        </div>
        <div className="flex w-1/4 p-4 flex-col">
          <div className="flex justify-center text-xl font-mono font-semibold mb-10 pb-2 border-y-2 border-t-0 border-b-prominent">
            <span className="text-green-500 mr-2">Ready</span> for Refinement
          </div>
          <StoryBuckets buckets={getDoneBuckets()} />
        </div>
      </div>
    </DragDropContext>
  );
};

export default PreRefinement;
