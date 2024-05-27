const StoryList = ({ stories, currentStoryIndex }) => {
  return (
    <div className="p-4 border-r" style={{ flexBasis: '25%' }}>
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
    </div>
  );
};

export default StoryList;
