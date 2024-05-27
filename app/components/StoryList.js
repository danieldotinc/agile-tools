const StoryList = ({ stories, currentStoryIndex, results }) => {
  return (
    <div className="w-1/4 p-4 border-r" style={{ flexBasis: '25%' }}>
      <h2 className="text-lg font-bold mb-4">Stories</h2>
      <ul>
        {stories.map((story, index) => (
          <li
            key={index}
            className={`mb-2 p-2 rounded flex justify-between items-center ${
              index === currentStoryIndex ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            <span>{story.name}</span>
            {results[index] && (
              <span className="bg-gray-300 text-black rounded-full px-2 py-1 ml-2">
                {results[index]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
