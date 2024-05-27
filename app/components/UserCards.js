const UserCards = ({ users, votes, revealed }) => {
  const getColor = (vote) => {
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
      return 'bg-red-500';
    }
  };

  return (
    <div className="flex justify-center space-x-4 mb-4">
      {users.map((user) => (
        <div
          key={user.id}
          className={`p-4 border rounded ${
            votes[user.username] ? getColor(votes[user.username]) : 'bg-gray-100'
          } text-white`}
        >
          <div className="text-center font-bold">{user.username}</div>
          {revealed && votes[user.username] && (
            <div className="text-center">{votes[user.username]}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserCards;
