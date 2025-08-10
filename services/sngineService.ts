
import { SngineUser, SngineUserGroup } from '../types';

/**
 * In a real Sngine environment, you would get an auth token
 * and make an API call to an endpoint like '/api/users/me'.
 *
 * This function simulates that process by creating a mock user
 * based on the selected user group.
 *
 * @param user_group The user group to log in as.
 * @returns A promise that resolves to a mock SngineUser object.
 */
export const loginAs = async (user_group: SngineUserGroup): Promise<SngineUser> => {
  console.log(`Simulating Sngine API call to login as user group: ${SngineUserGroup[user_group]}`);

  // Create mock user data based on the selected group
  const user_name = `Sngine${SngineUserGroup[user_group]}`;
  const user_id = user_group.toString();

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser: SngineUser = {
        user_id,
        user_name,
        user_group,
      };
      console.log("Simulated user data created:", mockUser);
      resolve(mockUser);
    }, 1000); // Simulate network delay
  });
};
