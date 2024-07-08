'use client';
import Image from 'next/image';
import UserCardType from './UserCardType';
import React, { useState } from 'react';

const UserCards = ({ users, stories, currentIndex }) => {
  const [cardType, setCardType] = useState(localStorage.getItem('card') ?? 'card');
  const revealed = stories[currentIndex].revealed;

  const getCard = (vote) => {
    if (vote && !revealed) return 'back-2';
    if (vote && revealed) return vote === 0.5 ? 'half' : vote;
    return 'back';
  };

  const handleCardTypeChange = (ct) => setCardType(ct);

  return (
    <>
      <UserCardType onCardTypeChange={handleCardTypeChange} />
      <div className="flex justify-center space-x-4 mb-4 flex-wrap">
        {revealed
          ? Object.entries(stories[currentIndex].votes).map(([username, vote]) => (
              <div key={username} className={`p-2 text-dark`}>
                <div className="text-center font-normal">{username}</div>
                {cardType === 'card' ? (
                  <Image
                    src={`/assets/${getCard(vote)}.png`}
                    className="w-24 h-32"
                    width={175}
                    height={300}
                    alt="vote"
                  />
                ) : (
                  <div className="w-24 h-32 rounded text-5xl bg-gray-100 text-black flex justify-center items-center">
                    {vote}
                  </div>
                )}
              </div>
            ))
          : users
              .filter((u) => u.username !== 'admin')
              .map((user) => (
                <div key={user.id} className={`p-2 text-dark`}>
                  <div className="text-center font-normal">{user.username}</div>

                  <Image
                    src={`/assets/${getCard(stories[currentIndex].votes[user.username])}.png`}
                    className="w-24 h-32"
                    width={175}
                    height={300}
                    alt="vote"
                  />
                </div>
              ))}
      </div>
    </>
  );
};

export default UserCards;
