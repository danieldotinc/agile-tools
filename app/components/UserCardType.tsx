'use client';
import React, { useState } from 'react';

const UserCardType = ({ onCardTypeChange }: { onCardTypeChange: (cardType: string) => void }) => {
  const [cardTypeName, setCardType] = useState(localStorage.getItem('card') ?? 'card');
  const isCard = cardTypeName === 'card';

  const handleToggle = () => {
    const newCardType = isCard ? 'number' : 'card';
    onCardTypeChange(newCardType);
    localStorage.setItem('card', newCardType);
    setCardType(newCardType);
  };

  return (
    <div className="flex items-center p-4">
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="hidden" checked={isCard} onChange={handleToggle} />
        <span className={`bg-gray-300 w-10 h-6 flex items-center  rounded-full p-1 duration-300 ease-in-out`}>
          <span
            className={`bg-gray-500 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
              isCard ? 'translate-x-4' : ''
            }`}
          ></span>
        </span>
        <span className="ml-2 text-gray-400">cards</span>
      </label>
    </div>
  );
};

export default UserCardType;
