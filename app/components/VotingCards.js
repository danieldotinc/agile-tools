const VotingCards = ({ onVote }) => {
    const cards = [0, 0.5, 1, 2, 3, 5, 8, 'Pass'];
  
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 flex justify-center space-x-4">
        {cards.map((card) => (
          <button
            key={card}
            onClick={() => onVote(card)}
            className="p-4 bg-blue-500 text-white rounded shadow-lg"
          >
            {card}
          </button>
        ))}
      </div>
    );
  };
  
  export default VotingCards;
  