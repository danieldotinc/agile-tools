const StoryList = ({ stories, currentStoryIndex, isAdmin }) => {
  return (
    <div className="w-1/4 p-4 border-r" style={{ minWidth: '200px', maxWidth: '25%' }}>
      <h2 className="text-lg font-bold mb-4">Stories</h2>
      <ul>
        {stories.map((story, index) => (
          <li
            key={index}
            className={`mb-2 p-2 rounded ${
              index === currentStoryIndex ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {story.name}
          </li>
        ))}
      </ul>
      {!isAdmin && stories.length === 0 && <p>No stories available</p>}
    </div>
  );
};

export default StoryList;
