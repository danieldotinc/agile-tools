const StoryList = ({ stories, currentStoryIndex }) => {
  return (
    <div className="w-1/4 p-4 border-r">
      <h2 className="font-bold mb-4">User Stories</h2>
      <ul>
        {stories.map((story, index) => (
          <li
            key={index}
            className={`p-2 mb-2 ${index === currentStoryIndex ? 'bg-blue-100' : ''}`}
          >
            <a href={story.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {story.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
