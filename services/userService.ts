import { User, UserRole } from '../types';

const PASSWORD_STORAGE_KEY = 'ai-news-assistant-admin-password';
const ADMIN_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin';

const getStoredPassword = (): string => {
  try {
    return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_PASSWORD;
  } catch (error) {
    console.warn("Could not access localStorage. Using default password.", error);
    return DEFAULT_PASSWORD;
  }
};

/**
 * Simulates a real login by checking a username and password.
 * The password persistence is handled by localStorage for this frontend-only app.
 * @param username The username to check.
 * @param password The password to check.
 * @returns A promise that resolves with a User object on success.
 */
export const login = async (username: string, password: string): Promise<User> => {
  console.log(`Attempting login for user: ${username}`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const storedPassword = getStoredPassword();

      if (username.toLowerCase() === ADMIN_USERNAME && password === storedPassword) {
        const user: User = {
          id: 'user_admin_01',
          name: 'Admin',
          role: UserRole.Admin,
        };
        console.log("Login successful");
        resolve(user);
      } else {
        console.warn("Login failed: Invalid credentials");
        reject(new Error('Invalid username or password.'));
      }
    }, 500); // Simulate network delay
  });
};

/**
 * Changes the admin password and saves it to localStorage.
 * @param oldPassword The user's current password.
 * @param newPassword The desired new password.
 * @returns A promise that resolves on success.
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    console.log("Attempting to change password.");

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const storedPassword = getStoredPassword();
            if (oldPassword !== storedPassword) {
                console.warn("Password change failed: Incorrect old password.");
                return reject(new Error("Your current password is not correct."));
            }

            if (!newPassword || newPassword.length < 4) {
                 return reject(new Error("New password must be at least 4 characters long."));
            }

            try {
                localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
                console.log("Password changed and saved to localStorage successfully.");
                resolve();
            } catch (error) {
                console.error("Failed to save new password to localStorage", error);
                reject(new Error("Could not save new password due to a storage error."));
            }
        }, 500);
    });
};
