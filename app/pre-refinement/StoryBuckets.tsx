'use client';
import { Droppable, Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowRight,
  faCommentMedical,
  faComments,
  faMagnifyingGlass,
  faUserNinja,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import { useState } from 'react';
import StoryDetails from './StoryDetails';
import { Teams, PreStory, usePreRefinement } from '../store/pre-refinement';

type Props = {
  teams: Teams;
};

const TEAM_COLOR = {
  Joker: 'bg-red-400',
  ScoobyDoo: 'bg-blue-400',
  Mercury: 'bg-green-400',
  Octopus: 'bg-yellow-400',
  Futurama: 'bg-pink-400',
};

const StoryBuckets = ({ teams }: Props) => {
  const [isStoryDetailVisible, setStoryDetailVisibility] = useState(false);
  const [selectedStory, setSelectedStory] = usePreRefinement((state) => [state.selectedStory, state.setDetailedStory]);
  const grid = 8;

  const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
    padding: 10,
    margin: `0 0 ${grid}px 0`,
    borderRadius: `8px`,
    background: 'rgb(51 65 85)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    // background: isDraggingOver ? 'darkgray' : 'dark',
    padding: grid,
    marginBottom: '30px',
    borderLeft: `1px solid #fcba03`,
    borderRadius: '8px',
  });

  const handleStoryDetailsView = (story: PreStory, index: number) => {
    if (!isStoryDetailVisible) setSelectedStory({ ...story, index });
    else setSelectedStory(undefined);

    setStoryDetailVisibility(!isStoryDetailVisible);
  };

  return (
    <>
      {isStoryDetailVisible && !!selectedStory && (
        <StoryDetails onClose={() => handleStoryDetailsView(selectedStory, 0)} />
      )}
      {Object.keys(teams).map((bucket) => (
        <Droppable droppableId={bucket} key={bucket}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
              <span className="text-lg font-mono text-prominent">{bucket.split('-')[0]}</span>
              {teams[bucket].map((story: PreStory, index: number) => (
                <Draggable key={story.id} draggableId={story.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <span className="flex flex-row justify-between">
                        {story.name}
                        {story.link ? (
                          <span className="flex flex-col">
                            <Link
                              className="rounded-full bg-blue-500 px-3 mx-1 text-white text-sm shadow-xl"
                              href={story.link}
                              target="_blank"
                              title="Open Jira Link"
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
                          onClick={() => handleStoryDetailsView(story, index)}
                          title="Open detail view"
                        />
                        <span className="flex items-center">
                          {!!story.comments ? (
                            <FontAwesomeIcon
                              size="lg"
                              icon={faComments}
                              color="orange"
                              className="fa-fw cursor-pointer mr-2"
                              title="See comments"
                              onClick={() => handleStoryDetailsView(story, index)}
                            />
                          ) : (
                            <FontAwesomeIcon
                              size="lg"
                              icon={faCommentMedical}
                              className="fa-fw cursor-pointer mr-2"
                              title="Add a comment"
                              onClick={() => handleStoryDetailsView(story, index)}
                            />
                          )}
                          {!!story.assigned ? (
                            <span
                              className={`rounded-full bg-prominent p-1 text-black font-mono text-xs shadow-xl mr-1 cursor-pointer`}
                              onClick={() => handleStoryDetailsView(story, index)}
                            >
                              {story.assigned}
                            </span>
                          ) : (
                            <FontAwesomeIcon
                              size="lg"
                              icon={faUserNinja}
                              className="fa-fw cursor-pointer mr-2"
                              title="Assign a Ninja"
                              onClick={() => handleStoryDetailsView(story, index)}
                            />
                          )}
                          {!!story.team ? (
                            <span
                              className={`rounded-full ${
                                TEAM_COLOR[story.team.split('-')[0]]
                              } p-1 text-black font-mono text-xs shadow-xl mr-1 cursor-pointer`}
                              onClick={() => handleStoryDetailsView(story, index)}
                              title="This is the assigned team"
                            >
                              {story.team.split('-')[0]}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </>
  );
};

export default StoryBuckets;
