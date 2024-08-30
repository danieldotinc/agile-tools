'use client';
import { faCommentMedical, faComments, faMagnifyingGlass, faUserNinja } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'STORY';

const TEAM_COLOR = {
  Joker: 'bg-red-400',
  ScoobyDoo: 'bg-blue-400',
  Mercury: 'bg-green-400',
  Octopus: 'bg-yellow-400',
  Futurama: 'bg-pink-400',
};

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
      className={`mb-2 p-2 rounded flex flex-col space-between cursor-pointer ${
        index === currentIndex ? 'bg-prominent text-background' : 'bg-opposite text-white'
      }`}
      onClick={() => onStorySelect(index)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="flex flex-row justify-between">
        {story.name}
        {story.link ? (
          <span className="flex flex-col">
            <Link
              title="Open Jira Link"
              className="rounded-full bg-blue-500 px-3 mx-1 text-white text-sm shadow-xl cursor-pointer"
              href={story.link}
              target="_blank"
            >
              jira
            </Link>
          </span>
        ) : null}
      </span>

      <span className="flex w-full mt-2 justify-between">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="fa-fw cursor-pointer"
          size="lg"
          // onClick={() => handleStoryDetailsView(story, index)}
          title="Open detail view"
        />
        <span className="flex items-center">
          {!!story.comments?.length ? (
            <FontAwesomeIcon
              size="lg"
              icon={faComments}
              color="orange"
              className="fa-fw cursor-pointer mr-2"
              title="See comments"
              // onClick={() => handleStoryDetailsView(story, index)}
            />
          ) : (
            <FontAwesomeIcon
              size="lg"
              icon={faCommentMedical}
              className="fa-fw cursor-pointer mr-2"
              title="Add a comment"
              // onClick={() => handleStoryDetailsView(story, index)}
            />
          )}
          {!!story.assigned ? (
            <span
              className={`rounded-full bg-prominent p-1 text-black font-mono text-xs shadow-xl mr-1 cursor-pointer`}
              // onClick={() => handleStoryDetailsView(story, index)}
            >
              {story.assigned}
            </span>
          ) : (
            <FontAwesomeIcon
              size="lg"
              icon={faUserNinja}
              className="fa-fw cursor-pointer mr-2"
              title="Assign a Ninja"
              // onClick={() => handleStoryDetailsView(story, index)}
            />
          )}
          {!!story.team ? (
            <span
              className={`rounded-full ${
                TEAM_COLOR[story.team.split('-')[0]]
              } p-1 text-black font-mono text-xs shadow-xl mr-2 cursor-pointer`}
              // onClick={() => handleStoryDetailsView(story, index)}
              title="This is the assigned team"
            >
              {story.team?.split('-')[0]}
            </span>
          ) : null}
        </span>
      </span>
    </li>
  );
};

const StoryList = ({ refinement, onStorySelect, currentIndex, onReorder, noStyling = false }) => {
  const moveStory = (fromIndex, toIndex) => {
    const updatedStories = Array.from(refinement.stories);
    const [movedStory] = updatedStories.splice(fromIndex, 1);
    updatedStories.splice(toIndex, 0, movedStory);
    onReorder(updatedStories, toIndex);
  };

  return (
    <div className={`${!noStyling ? 'w-1/4 p-4 border-r' : ''}`} style={{ flexBasis: '25%' }}>
      {!noStyling ? (
        <h2 className="text-lg font-bold mb-4">
          Stories : <span className="text-prominent">{refinement?.name}</span>
        </h2>
      ) : null}
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
