const VotingCards = ({ onVote, story, username }) => {
  const cards = [0.5, 1, 2, 3, 5, 8, 'Pass'];

  return (
    <div className="flex justify-center space-x-4">
      {cards.map(card => (
        <button
          key={card}
          onClick={() => onVote(card)}
          className={`w-16 py-8 hover:transition hover:transform hover:-translate-y-6 ${
            story.votes[username] == card ? '-translate-y-6' : ''
          } hover:bg-amber-500 rounded text-xl ${
            story.votes[username] == card ? 'bg-cyan-600 text-white' : 'bg-primary'
          }`}
        >
          {card}
        </button>
      ))}
    </div>
  );
};

export default VotingCards;
