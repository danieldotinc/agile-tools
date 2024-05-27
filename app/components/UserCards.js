const UserCards = ({ users, votes, revealed }) => {
    return (
      <div className="flex justify-center space-x-4 mb-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 border rounded ${
              votes[user.username] ? 'bg-red-500 text-white' : 'bg-gray-100'
            }`}
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
  