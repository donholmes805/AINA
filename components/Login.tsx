import React, { useState, useCallback } from 'react';
import { login } from '../services/userService';
import { type User } from '../types';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both a username and password.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await login(username, password);
      onLogin(user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during login.");
      }
      setIsLoading(false);
    }
  }, [username, password, onLogin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <Icon name="newspaper" className="mx-auto w-16 h-16 text-blue-600 dark:text-blue-500" />
            <h1 className="mt-4 text-3xl font-extrabold text-gray-800 dark:text-white">
              AI News Assistant
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Admin Login
            </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 space-y-6">
          <div className="space-y-4">
             <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="admin"
                disabled={isLoading}
              />
            </div>
             <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3" role="alert">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? <Spinner size="sm"/> : <Icon name="admin" className="w-5 h-5"/>}
            <span>{isLoading ? 'Logging In...' : 'Login'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
