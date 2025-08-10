import React, { useState, useCallback } from 'react';
import NewsAssistant from './components/NewsAssistant';
import Login from './components/Login';
import type { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <NewsAssistant user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
