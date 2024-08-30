'use client';

import * as React from 'react';
import PromptName from '@/app/components/PromptName';
import { AuthContext } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, username, handleSubmit } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, [username]);

  return (
    <AuthContext.Provider value={{ username, isAdmin }}>
      <Loading isLoading={isLoading} />
      {!isLoading && !username && <PromptName onNameSubmit={handleSubmit} />}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
