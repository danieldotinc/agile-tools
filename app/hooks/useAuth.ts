import { useEffect, useState } from 'react';

const admin = 'admin';

const useAuth = () => {
  const [username, setUsername] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (savedName) {
      setUsername(savedName);
      setIsAdmin(savedName === admin);
    }
  }, []);

  const handleSubmit = (name: string) => {
    setUsername(name);
    setIsAdmin(name === admin);
    localStorage.setItem('username', name);
  };

  return { username, isAdmin, handleSubmit };
};

export default useAuth;
