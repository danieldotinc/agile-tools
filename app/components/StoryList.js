'use client';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'STORY';

const StoryItem = ({ story, index, moveStory, onStorySelect, currentIndex }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index !== index) {
        moveStory(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`mb-2 p-2 rounded flex justify-between items-center cursor-pointer ${
        index === currentIndex ? 'bg-prominent text-background' : 'bg-opposite text-white'
      }`}
      onClick={() => onStorySelect(index)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span>{story.name}</span>
      <span
        className={`bg-gray-100 ${index === currentIndex ? 'bg-gray-100' : ''} text-black rounded-full px-3 py-1 ml-2`}
      >
        {story.result ?? '-'}
      </span>
    </li>
  );
};

const StoryList = ({ refinement, onStorySelect, currentIndex, onReorder }) => {
  const moveStory = (fromIndex, toIndex) => {
    const updatedStories = Array.from(refinement.stories);
    const [movedStory] = updatedStories.splice(fromIndex, 1);
    updatedStories.splice(toIndex, 0, movedStory);
    onReorder(updatedStories, toIndex);
  };

  return (
    <div className="w-1/4 p-4 border-r" style={{ flexBasis: '25%' }}>
      <h2 className="text-lg font-bold mb-4">
        Stories : <span className="text-prominent">{refinement?.name}</span>
      </h2>
      <ul>
        {refinement?.stories.map((story, index) => (
          <StoryItem
            key={story.name}
            index={index}
            story={story}
            moveStory={moveStory}
            onStorySelect={onStorySelect}
            currentIndex={currentIndex}
          />
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
