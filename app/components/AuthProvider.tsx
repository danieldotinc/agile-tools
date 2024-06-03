'use client';

import * as React from 'react';
import PromptName from '@/app/components/PromptName';
import { AuthContext } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, username, handleSubmit } = useAuth();

  return (
    <AuthContext.Provider value={{ username, isAdmin }}>
      {!username && <PromptName onNameSubmit={handleSubmit} />}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
