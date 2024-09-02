'use client';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { Droppable, Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import socket from '@/app/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentMedical,
  faComments,
  faMagnifyingGlass,
  faPaperPlane,
  faUserNinja,
} from '@fortawesome/free-solid-svg-icons';

import { Teams } from '../store/pre-refinement';
import { Story } from '../store/story';

type Props = {
  teams: Teams;
  onStorySelect: (story: Story, index: number) => void;
};

enum TEAM_COLOR {
  Joker = 'bg-red-400',
  ScoobyDoo = 'bg-blue-400',
  Mercury = 'bg-green-400',
  Octopus = 'bg-yellow-400',
  Futurama = 'bg-pink-400',
}

const StoryBuckets = ({ teams, onStorySelect }: Props) => {
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

  const handleSendingToRefinement = (story: Story) =>
    socket.emit('sendStoryToRefinement', { ...story, refinementId: nanoid(6) });

  // const handleMovingToDone = (story: Story, index: number) => {
  //   return;
  // };

  // const handleMovingToProgress = (story: Story, index: number) => {
  //   return;
  // };

  return Object.keys(teams).map((bucket) => (
    <Droppable droppableId={bucket} key={bucket}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
          <span className="text-lg font-mono text-prominent">{bucket.split('-')[0]}</span>
          {teams[bucket].map((story: Story, index: number) => (
            <Draggable key={story.id} draggableId={story.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(snapshot.isDragging, provided.draggableProps.style) as any}
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
                      onClick={() => onStorySelect(story, index)}
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
                          onClick={() => onStorySelect(story, index)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          size="lg"
                          icon={faCommentMedical}
                          className="fa-fw cursor-pointer mr-2"
                          title="Add a comment"
                          onClick={() => onStorySelect(story, index)}
                        />
                      )}
                      {!!story.assigned ? (
                        <span
                          className={`rounded-full bg-prominent p-1 text-black font-mono text-xs shadow-xl mr-1 cursor-pointer`}
                          onClick={() => onStorySelect(story, index)}
                        >
                          {story.assigned}
                        </span>
                      ) : (
                        <FontAwesomeIcon
                          size="lg"
                          icon={faUserNinja}
                          className="fa-fw cursor-pointer mr-2"
                          title="Assign a Ninja"
                          onClick={() => onStorySelect(story, index)}
                        />
                      )}
                      {!!story.team ? (
                        <span
                          className={`rounded-full ${
                            TEAM_COLOR[story.team.split('-')[0] as keyof typeof TEAM_COLOR]
                          } p-1 text-black font-mono text-xs shadow-xl mr-2 cursor-pointer`}
                          onClick={() => onStorySelect(story, index)}
                          title="This is the assigned team"
                        >
                          {story.team.split('-')[0]}
                        </span>
                      ) : null}
                      {!!story.team && story.team.includes('-D') ? (
                        <FontAwesomeIcon
                          size="lg"
                          icon={faPaperPlane}
                          className="fa-fw cursor-pointer mr-2"
                          title={`Send to ${story.team.split('-')[0]} refinement`}
                          onClick={() => handleSendingToRefinement(story)}
                        />
                      ) : null}
                      {/* {!!story.team && story.team.includes('-P') ? (
                        <FontAwesomeIcon
                          size="lg"
                          icon={faForward}
                          className="fa-fw cursor-pointer mr-2"
                          title={`Move to ready-for-refinement column`}
                          onClick={() => handleMovingToDone(story, index)}
                        />
                      ) : null}
                      {!!story.team && !story.team.includes('Stories') && !story.team.includes('-') ? (
                        <FontAwesomeIcon
                          size="lg"
                          icon={faForward}
                          className="fa-fw cursor-pointer mr-2"
                          title={`Move to in-progress column`}
                          onClick={() => handleMovingToProgress(story, index)}
                        />
                      ) : null} */}
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
  ));
};

export default StoryBuckets;
