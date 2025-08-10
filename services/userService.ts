import { User, UserRole } from '../types';

/**
 * In a real application, this would make an API call to a backend
 * to authenticate a user and get their profile.
 *
 * This function simulates that process by creating a mock user
 * based on the selected role.
 *
 * @param role The role to log in as.
 * @returns A promise that resolves to a mock User object.
 */
export const loginAs = async (role: UserRole): Promise<User> => {
  console.log(`Simulating login as: ${role}`);

  // Create mock user data based on the selected role
  const user: User = {
    id: role === UserRole.Admin ? 'user_admin_01' : 'user_anchor_01',
    name: role === UserRole.Admin ? 'Alex (Admin)' : 'Casey (Anchor)',
    role: role,
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Simulated user created:", user);
      resolve(user);
    }, 500); // Simulate network delay
  });
};
