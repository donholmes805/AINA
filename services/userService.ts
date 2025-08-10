import { User } from '../types';

/**
 * Calls the backend API to log in a user.
 * @param username The username to check.
 * @param password The password to check.
 * @returns A promise that resolves with a User object on success.
 */
export const login = async (username: string, password: string): Promise<User> => {
  console.log(`Attempting login for user: ${username}`);
  
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed.');
  }

  const user = await response.json();
  console.log("Login successful");
  return user;
};

/**
 * Calls the backend API to change the admin password.
 * @param oldPassword The user's current password.
 * @param newPassword The desired new password.
 * @returns A promise that resolves on success.
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    console.log("Attempting to change password via API.");

    const response = await fetch('/api/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to change password.');
    }
    
    console.log("Password changed successfully.");
};
