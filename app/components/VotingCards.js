'use client';

import { useState } from 'react';

const VotingCards = ({ onVote }) => {
  const cards = [0.5, 1, 2, 3, 5, 8, 'Pass'];
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex justify-center space-x-4">
      {cards.map(card => (
        <button
          key={card}
          onClick={() => {
            setSelected(card);
            onVote(card);
          }}
          className={`p-11  hover:bg-amber-500 rounded text-2xl ${selected == card ? 'bg-red-500' : 'bg-primary'}`}
        >
          {card}
        </button>
      ))}
    </div>
  );
};

export default VotingCards;
