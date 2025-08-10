import React, { useState, useCallback } from 'react';
import { loginAs } from '../services/userService';
import { UserRole, type User } from '../types';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleLogin = useCallback(async (role: UserRole) => {
    setLoadingRole(role);
    try {
      const user = await loginAs(role);
      onLogin(user);
    } catch (error) {
      console.error("Login simulation failed", error);
      setLoadingRole(null); // Reset loading state on error
    }
  }, [onLogin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md text-center">
        <Icon name="newspaper" className="mx-auto w-20 h-20 text-blue-600 dark:text-blue-500" />
        <h1 className="mt-4 text-4xl font-extrabold text-gray-800 dark:text-white">
          AI News Assistant
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Please select your role to continue.
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleLogin(UserRole.Admin)}
            disabled={!!loadingRole}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            {loadingRole === UserRole.Admin ? <Spinner size="sm"/> : <Icon name="admin" className="w-6 h-6 text-blue-600" />}
            <span>Log in as Admin</span>
          </button>
          <button
            onClick={() => handleLogin(UserRole.Anchor)}
            disabled={!!loadingRole}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            {loadingRole === UserRole.Anchor ? <Spinner size="sm"/> : <Icon name="anchor" className="w-6 h-6 text-teal-500" />}
            <span>Log in as Anchor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
