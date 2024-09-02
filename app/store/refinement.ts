import { create } from 'zustand';
import socket from '@/app/socket';
import { Story } from './story';

export type Teams = Record<string, Story[]>;
export type User = { id: string; username: string };

export type RefinementDoc = {
  id: string;
  name: string;
  stories: Story[];
  users: User[];
  currentIndex: number;
};

type Refinement = {
  id?: string;
  name?: string;
  stories: Story[];
  users: User[];
  currentIndex?: number;
  selectedStory?: Story;
  updateStory: (story: Story) => void;
  setDetailedStory: (story?: Story) => void;
  setRefinement: (refinement: RefinementDoc) => void;
};

export const useRefinement = create<Refinement>((set) => ({
  users: [],
  stories: [],
  id: undefined,
  name: undefined,
  currentIndex: 0,
  selectedStory: undefined,
  setRefinement: (refinement: RefinementDoc) =>
    set((state) => ({
      stories: refinement.stories,
      id: refinement.id,
      currentIndex: refinement.currentIndex,
      name: refinement.name,
      users: refinement.users,
    })),
  setDetailedStory: (story?: Story) => set((state) => ({ selectedStory: story })),
  updateStory: (story: Story) => {
    set((state) => {
      const clonedStories = [...state.stories];
      const storyIndex = clonedStories.findIndex((st) => st.id === story.id);
      if (storyIndex === -1) {
        console.log('error: story not found');
        return;
      }
      socket.emit('updateStory', story);

      clonedStories[storyIndex] = { ...story };
      socket.emit('updateStories', { refinementId: state.id, stories: clonedStories });

      return { stories: clonedStories };
    });
  },
}));
