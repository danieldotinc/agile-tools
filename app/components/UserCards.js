import Image from 'next/image';

const UserCards = ({ users, stories, currentIndex, revealed }) => {
  const getColor = vote => {
    if (revealed) {
      switch (vote) {
        case 0:
          return 'bg-green-500';
        case 0.5:
          return 'bg-blue-500';
        case 1:
          return 'bg-yellow-500';
        case 2:
          return 'bg-orange-500';
        case 3:
          return 'bg-purple-500';
        case 5:
          return 'bg-red-500';
        case 8:
          return 'bg-pink-500';
        case 'Pass':
          return 'bg-gray-500';
        default:
          return 'bg-gray-100';
      }
    } else {
      return 'bg-cyan-600 text-white';
    }
  };

  const getCard = vote => {
    if (vote && !revealed) return 'back-2';
    if (vote && revealed) return vote === 0.5 ? 'half' : vote;
    return 'back';
  };

  return (
    <div className="flex justify-center space-x-4 mb-4">
      {users
        .filter(u => u.username !== 'admin')
        .map(user => (
          <div key={user.id} className={`p-2 text-dark`}>
            <div className="text-center font-normal">{user.username}</div>
            <Image
              src={`/assets/${getCard(stories[currentIndex].votes[user.username])}.png`}
              className="w-24"
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
