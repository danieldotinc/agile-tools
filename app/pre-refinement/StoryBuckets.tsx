'use client';
import { Droppable, Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import Link from 'next/link';

export type PreStory = {
  id: string;
  name: string;
  link?: string;
};

export type Buckets = Record<string, PreStory[]>;

type Props = {
  buckets: Buckets;
};

const StoryBuckets = ({ buckets }: Props) => {
  const grid = 8;

  const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
    padding: 10,
    margin: `0 0 ${grid}px 0`,
    'border-radius': `8px`,
    background: 'rgb(51 65 85)',
    display: 'flex',
    'justify-content': 'space-between',
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    // background: isDraggingOver ? 'darkgray' : 'dark',
    padding: grid,
    'margin-bottom': '30px',
    'border-left': `1px solid #fcba03`,
    'border-radius': '8px',
  });

  return (
    <>
      {Object.keys(buckets).map((bucket) => (
        <Droppable droppableId={bucket} key={bucket}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
              <span className="text-lg font-mono text-prominent">{bucket.split('-')[0]}</span>
              {buckets[bucket].map((story: PreStory, index: number) => (
                <Draggable key={story.id} draggableId={story.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      {story.name}
                      {story.link ? (
                        <span>
                          <Link
                            className="rounded-full bg-blue-500 px-3 py-1 mx-1 text-white text-sm shadow-xl"
                            href={story.link}
                            target="_blank"
                          >
                            jira
                          </Link>
                        </span>
                      ) : null}
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
