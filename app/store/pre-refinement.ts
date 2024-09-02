import { create } from 'zustand';
import socket from '@/app/socket';
import { Story } from './story';

export type Teams = Record<string, Story[]>;

type PreRefinement = {
  teams: Teams;
  preRefId?: string;
  selectedStory?: Story;
  setTeams: (teams: Teams) => void;
  setPreRefId: (id: string) => void;
  updateStory: (story: Story) => void;
  setDetailedStory: (story?: Story) => void;
};

export const usePreRefinement = create<PreRefinement>((set) => ({
  preRefId: undefined,
  selectedStory: undefined,
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
  setTeams: (teams: Teams) => set((state) => ({ teams: { ...teams } })),
  setPreRefId: (id: string) => set((state) => ({ preRefId: id })),
  setDetailedStory: (story?: Story) => set((state) => ({ selectedStory: story })),
  updateStory: (story: Story) =>
    set((state) => {
      const team = story.team ?? 'Stories';
      const clonedTeam = [...state.teams[team]];
      const storyIndex = clonedTeam.findIndex((st) => st.id === story.id);
      if (storyIndex === -1) {
        console.log('error: story not found');
        return;
      }
      const clonedTeams = { ...state.teams };
      clonedTeams[team][storyIndex] = { ...story };
      socket.emit('updateTeams', { preRefId: state.preRefId, teams: clonedTeams });
      return { teams: clonedTeams };
    }),
}));
