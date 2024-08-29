'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { usePreRefinement } from '../store/pre-refinement';
import Link from 'next/link';

type Props = {
  onClose: () => void;
};

const StoryDetails = ({ onClose }: Props) => {
  const [story, setSelectedStory] = usePreRefinement((state) => [state.selectedStory, state.setDetailedStory]);
  const [comment, setComment] = useState('');
  const [assigned, setAssigned] = useState('');

  const updateStory = usePreRefinement((state) => state.updateStory);

  const handleAssign = (e: React.MouseEvent) => {
    e.preventDefault();
    const updated = { ...story!, assigned };
    setSelectedStory(updated);
    updateStory(updated);
    setAssigned('');
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    const updatedComments = story!.comments ? [...story!.comments, comment] : [comment];
    const updated = { ...story!, comments: updatedComments };
    setSelectedStory(updated);
    updateStory(updated);
    setComment('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <form className="bg-gray-800 rounded shadow-lg">
        <span className="flex justify-end p-3">
          <FontAwesomeIcon icon={faXmarkCircle} className="fa-fw cursor-pointer" size="xl" onClick={onClose} />
        </span>
        <div className="p-8 pt-2">
          <h2 className="text-xl mb-4">{story?.name}</h2>
          <div className="mb-5">
            <span
              className={`rounded-full ${
                story?.team?.includes('Joker') ? 'bg-prominent' : 'bg-gray-500'
              } px-3 py-1 text-black text-sm font-mono shadow-xl mr-1`}
            >
              Joker
            </span>
            <span
              className={`rounded-full ${
                story?.team?.includes('ScoobyDoo') ? 'bg-prominent' : 'bg-gray-500'
              } px-3 py-1 text-black font-mono text-sm shadow-xl mr-1`}
            >
              ScoobyDoo
            </span>
            <span
              className={`rounded-full ${
                story?.team?.includes('Mercury') ? 'bg-prominent' : 'bg-gray-500'
              } px-3 py-1 text-black font-mono text-sm shadow-xl mr-1`}
            >
              Mercury
            </span>
            <span
              className={`rounded-full ${
                story?.team?.includes('Futurama') ? 'bg-prominent' : 'bg-gray-500'
              } px-3 py-1 text-black font-mono text-sm shadow-xl mr-1`}
            >
              Futurama
            </span>
            <span
              className={`rounded-full ${
                story?.team?.includes('Octopus') ? 'bg-prominent' : 'bg-gray-500'
              } px-3 py-1 text-black font-mono text-sm shadow-xl mr-1`}
            >
              Octopus
            </span>
            {story?.link ? (
              <span className="">
                <Link
                  className="rounded-full bg-blue-500 px-3 py-1 mx-1 text-white text-sm shadow-xl"
                  href={story.link}
                  target="_blank"
                  title="Open Jira Link"
                >
                  jira
                </Link>
              </span>
            ) : null}
          </div>
          <div className="flex items-center mb-4 ">
            <input
              type="text"
              value={assigned}
              onChange={(e) => setAssigned(e.target.value)}
              className="border border-gray-500 rounded font-mono shadow-xl"
              placeholder=" assign to..."
            />
            <button className="bg-blue-500 text-white p-1 mx-2 rounded text-xs" onClick={handleAssign}>
              assign
            </button>
            {story?.assigned ? (
              <span>
                Assigned to: <span className="text-prominent">{story.assigned}</span>
              </span>
            ) : null}
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border w-3/4 border-gray-500 font-mono rounded shadow-xl"
              placeholder=" comment..."
            />
            <button className="bg-blue-500 text-white p-1 mx-2 rounded text-xs" onClick={handleComment}>
              comment
            </button>
          </div>
          <div className="mt-5">
            {story?.comments?.map((comment, index) => (
              <p className="p-1 font-mono text-md">
                {index + 1}- {comment}
              </p>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoryDetails;
