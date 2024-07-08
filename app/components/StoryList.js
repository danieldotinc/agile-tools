const StoryList = ({ refinement, onStorySelect, currentIndex }) => {
  return (
    <div className="w-1/4 p-4 border-r" style={{ flexBasis: '25%' }}>
      <h2 className="text-lg font-bold mb-4">Stories : <span className="text-prominent">{refinement?.name}</span></h2>
      <ul>
        {refinement?.stories.map((story, index) => (
          <li
            key={index}
            className={`mb-2 p-2 rounded flex justify-between items-center cursor-pointer ${
              index === currentIndex ? 'bg-prominent text-background' : 'bg-opposite text-white'
            }`}
            onClick={() => onStorySelect(index)}
          >
            <span>{story.name}</span>
            <span
              className={`bg-gray-100 ${
                index === currentIndex ? 'bg-gray-100' : ''
              } text-black rounded-full px-3 py-1 ml-2`}
            >
              {refinement.stories[index].result ?? '-'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
