'use client';
import { FormEvent, useEffect, useState } from 'react';
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd';
import { nanoid } from 'nanoid';

import socket from '@/app/socket';
import { useAuthContext } from '@/app/context/AuthContext';

import PreStoryBuckets from './PreStoryBuckets';
import StoryDetails from '../components/StoryDetails';

import { Story } from '../store/story';
import { usePreRefinement, Teams } from '../store/pre-refinement';

type PreRefinement = {
  currentIndex: number;
  stories: Story[];
};

const PreRefinement = () => {
  const { isAdmin } = useAuthContext();

  const updateStory = usePreRefinement((state) => state.updateStory);
  const [isStoryDetailVisible, setStoryDetailVisibility] = useState(false);
  const [teams, setTeams] = usePreRefinement((state) => [state.teams, state.setTeams]);
  const [preRefId, setPreRefId] = usePreRefinement((state) => [state.preRefId, state.setPreRefId]);
  const [selectedStory, setSelectedStory] = usePreRefinement((state) => [state.selectedStory, state.setDetailedStory]);

  const updateTeams = (updatedTeams: Teams) => {
    setTeams(updatedTeams);
    socket.emit('updateTeams', { preRefId, teams: updatedTeams });
  };

  const reorder = (list: Story[], startIndex: number, endIndex: number): Story[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = reorder(teams[source.droppableId], source.index, destination.index);
      updateTeams({ ...teams, [source.droppableId]: items });
    } else {
      const sourceClone = Array.from(teams[source.droppableId]);
      const destClone = Array.from(teams[destination.droppableId]);
      const [removed] = sourceClone.splice(source.index, 1);

      removed.team = destination.droppableId;
      destClone.splice(destination.index, 0, removed);

      updateTeams({
        ...teams,
        [source.droppableId]: sourceClone,
        [destination.droppableId]: destClone,
      });
    }
  };

  const filterTeamBuckets = () => ({
    Stories: [...(teams.Stories ?? [])],
  });

  const getReadyTeams = () => ({
    Joker: [...(teams.Joker ?? [])],
    Mercury: [...(teams.Mercury ?? [])],
    ScoobyDoo: [...(teams.ScoobyDoo ?? [])],
    Futurama: [...(teams.Futurama ?? [])],
    Octopus: [...(teams.Octopus ?? [])],
  });

  const getProgressTeams = () => ({
    'Joker-P': [...(teams['Joker-P'] ?? [])],
    'Mercury-P': [...(teams['Mercury-P'] ?? [])],
    'ScoobyDoo-P': [...(teams['ScoobyDoo-P'] ?? [])],
    'Futurama-P': [...(teams['Futurama-P'] ?? [])],
    'Octopus-P': [...(teams['Octopus-P'] ?? [])],
  });

  const getDoneTeams = () => ({
    'Joker-D': [...(teams['Joker-D'] ?? [])],
    'Mercury-D': [...(teams['Mercury-D'] ?? [])],
    'ScoobyDoo-D': [...(teams['ScoobyDoo-D'] ?? [])],
    'Futurama-D': [...(teams['Futurama-D'] ?? [])],
    'Octopus-D': [...(teams['Octopus-D'] ?? [])],
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (document.getElementById('story-name') as HTMLInputElement).value;
    const link = (document.getElementById('story-link') as HTMLInputElement).value;
    if (String(name).trim()) {
      const cloned = { ...teams };
      const createdPreStory = { name: String(name).trim(), link, id: nanoid(10) };
      cloned['Stories'].unshift(createdPreStory);
      updateTeams(cloned);

      socket.emit('addPreStory', { ...createdPreStory, preRefId: preRefId ?? nanoid(6) });
      (document.getElementById('story-name') as HTMLInputElement).value = '';
      (document.getElementById('story-link') as HTMLInputElement).value = '';
    }
  };

  const handleStoryDetailsView = (story: Story, index: number) => {
    if (!isStoryDetailVisible) setSelectedStory({ ...story, index });
    else setSelectedStory(undefined);

    setStoryDetailVisibility(!isStoryDetailVisible);
  };

  const handleStoryUpdate = (story: Story) => {
    setSelectedStory(story);
    updateStory(story);
  };

  useEffect(() => {
    socket.emit('getPreRefinement');

    socket.on('initPreRefinement', (preRefinement) => {
      setTeams({ ...preRefinement.teams });
      setPreRefId(preRefinement.id);
    });

    socket.on('updatePreRefinement', (preRefinement) => {
      setTeams({ ...preRefinement.teams });
    });

    return () => {
      socket.off('initPreRefinement');
      socket.off('updatePreRefinement');
    };
  }, []);

  return (
    <>
      {isStoryDetailVisible && !!selectedStory && (
        <StoryDetails
          story={selectedStory}
          onStoryUpdate={handleStoryUpdate}
          onClose={() => handleStoryDetailsView(selectedStory, 0)}
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1">
          <div className="w-1/4 p-4 border-r">
            {isAdmin && (
              <div className="flex-1 mb-10">
                <div className="mt-4 ">
                  <form onSubmit={handleSubmit}>
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
                      {/* <button className="bg-red-500 text-white p-2 rounded">Delete</button> */}
                    </div>
                  </form>
                </div>
              </div>
            )}
            <PreStoryBuckets onStorySelect={handleStoryDetailsView} teams={filterTeamBuckets()} />
          </div>
          <div className="flex w-1/4 p-4 border-r flex-col">
            <div className="flex justify-center text-xl font-mono font-semibold mb-10 pb-2 border-y-2 border-t-0 border-b-prominent">
              <span className="text-red-400 mr-2">Ready</span>for Pre-Refinement
            </div>
            <PreStoryBuckets onStorySelect={handleStoryDetailsView} teams={getReadyTeams()} />
          </div>
          <div className="flex w-1/4 p-4 border-r flex-col">
            <div className="flex justify-center text-xl font-mono font-semibold mb-10 pb-2 border-y-2 border-t-0 border-b-prominent">
              Pre-Refinement <span className="text-blue-400 ml-2"> In-Progress</span>
            </div>
            <PreStoryBuckets onStorySelect={handleStoryDetailsView} teams={getProgressTeams()} />
          </div>
          <div className="flex w-1/4 p-4 flex-col">
            <div className="flex justify-center text-xl font-mono font-semibold mb-10 pb-2 border-y-2 border-t-0 border-b-prominent">
              <span className="text-green-500 mr-2">Ready</span> for Refinement
            </div>
            <PreStoryBuckets onStorySelect={handleStoryDetailsView} teams={getDoneTeams()} />
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default PreRefinement;
