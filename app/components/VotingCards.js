const VotingCards = ({ onVote }) => {
  const cards = [0, 0.5, 1, 2, 3, 5, 8, 'Pass'];

  return (
    <div className="flex justify-center space-x-4">
      {cards.map((card) => (
        <button
          key={card}
          onClick={() => onVote(card)}
          className="p-4 bg-gray-200 hover:bg-gray-300 rounded"
        >
          {card}
        </button>
      ))}
    </div>
  );
};

export default VotingCards;
