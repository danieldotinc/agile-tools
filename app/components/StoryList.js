const StoryList = ({ stories, currentStoryIndex }) => {
  return (
    <div className="w-1/4 p-4 border-r" style={{ flexBasis: '25%' }}>
      <h2 className="text-lg font-bold mb-4">Stories</h2>
      <ul>
        {stories.map((story, index) => (
          <li
            key={index}
            className={`mb-2 p-2 rounded flex justify-between items-center ${
              index === currentStoryIndex ? 'bg-prominent text-background' : 'bg-opposite text-white'
            }`}
          >
            <span>{story.name}</span>
            <span
              className={`bg-gray-100 ${
                index === currentStoryIndex ? 'bg-gray-100' : ''
              } text-black rounded-full px-3 py-1 ml-2`}
            >
              {stories[index].result ?? '-'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
