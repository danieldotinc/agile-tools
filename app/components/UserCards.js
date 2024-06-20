import Image from 'next/image';

const UserCards = ({ users, stories, currentIndex }) => {
  const revealed = stories[currentIndex].revealed;

  const getCard = (vote) => {
    if (vote && !revealed) return 'back-2';
    if (vote && revealed) return vote === 0.5 ? 'half' : vote;
    return 'back';
  };

  return (
    <div className="flex justify-center space-x-4 mb-4 flex-wrap">
      {users
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
  );
};

export default UserCards;
