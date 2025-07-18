export enum SEX {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface User {
  id: number;
  name: string;
  surname: string;
  sex: SEX;
  address: string;
  weight: number;
  height: number;
  imagePath: string;
  createdAt: string;
  updatedAt: string;
} 