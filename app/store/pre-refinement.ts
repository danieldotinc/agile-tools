import { create } from 'zustand';
import { FAKE_STORIES_1, FAKE_STORIES_2 } from './fake';

export type PreStory = {
  id: string;
  name: string;
  comments?: string[];
  team?: string;
  link?: string;
  index?: number;
  assigned?: string;
};

export type Teams = Record<string, PreStory[]>;

type PreRefinement = {
  teams: Teams;
  selectedStory?: PreStory;
  setTeams: (teams: Teams) => void;
  updateStory: (story: PreStory) => void;
  setDetailedStory: (story?: PreStory) => void;
};

export const usePreRefinement = create<PreRefinement>((set) => ({
  selectedStory: undefined,
  teams: {
    Stories: [...FAKE_STORIES_1],
    Joker: [...FAKE_STORIES_2],
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
  setDetailedStory: (story: PreStory) => set((state) => ({ selectedStory: story })),
  updateStory: (story: PreStory) =>
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
      return { teams: clonedTeams };
    }),
}));
