import { User } from '@/interfaces/user';

export const areUsersEqual = (user1: User, user2: User) => {
  const keysToCompare: (keyof User)[] = ['name', 'surname', 'weight', 'height', 'sex', 'address', 'imagePath'];

  return keysToCompare.every((key) => user1[key] === user2[key]);
};
