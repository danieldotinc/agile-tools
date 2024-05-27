"use client";

const UserCards = ({ users, votes, revealed }) => {
    const groupedVotes = {};
    Object.entries(votes).forEach(([user, vote]) => {
      if (groupedVotes[vote]) {
        groupedVotes[vote].push(user);
      } else {
        groupedVotes[vote] = [user];
      }
    });

    return (
        <div className="flex justify-center space-x-4 mb-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-4 border rounded ${
                revealed && votes[user.username] ? 'bg-red-500 text-white' : 'bg-gray-100'
              }`}
            >
              <div className="text-center font-bold">{user.username}</div>
              {revealed && votes[user.username] && (
                <div className="text-center">{votes[user.username]}</div>
              )}
            </div>
          ))}
          {revealed &&
            Object.entries(groupedVotes).map(([vote, users], index) => (
              <div
                key={index}
                className={`p-4 border rounded bg-${getColor(users.length)} text-white`}
              >
                <div className="text-center font-bold">{vote}</div>
                <div className="text-center">{users.join(', ')}</div>
              </div>
            ))}
        </div>
      );
    };
    
    export default UserCards;
    
    // Helper function to determine card color based on the number of users with the same vote
    const getColor = (count) => {
      if (count <= 2) {
        return 'green-500'; // green for 1 or 2 users
      } else if (count <= 5) {
        return 'yellow-500'; // yellow for 3 to 5 users
      } else {
        return 'red-500'; // red for more than 5 users
      }
    };
    