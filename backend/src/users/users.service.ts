import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './updateUser.dto';
import { CreateUserDto } from './createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(offset = 0, limit = 10): Promise<{ users: User[]; totalUsers: number }> {
    const [users, totalUsers] = await this.usersRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, totalUsers };
  }

  async createNewUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }
    return user;
  }

  async deleteUserById(userId: number): Promise<{ success: boolean }> {
    await this.usersRepository.delete(userId);
    return { success: true };
  }

  async updateUserById(userId: number, updateUserDto: UpdateUserDto, image?: Express.Multer.File): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({ error: 'User not found!' });
    }

    const isUpdated = await this.verifyChanges(user, updateUserDto, image);
    if (!isUpdated) {
      throw new BadRequestException({ error: 'No changes were made!' });
    }

    for (const key in updateUserDto) {
      const value = updateUserDto[key];
      if (value !== undefined && value !== null) {
        user[key] = value;
      }
    }

    return await this.usersRepository.save(user);
  }

  async verifyChanges(user: User, updateUserDto: UpdateUserDto, image?: Express.Multer.File): Promise<boolean> {
    if (updateUserDto.name && updateUserDto.name !== user.name) return true;
    if (updateUserDto.surname && updateUserDto.surname !== user.surname) return true;
    if (updateUserDto.weight && updateUserDto.weight !== user.weight) return true;
    if (updateUserDto.height && updateUserDto.height !== user.height) return true;
    if (updateUserDto.sex && updateUserDto.sex !== user.sex) return true;
    if (updateUserDto.address && updateUserDto.address !== user.address) return true;

    if (image) return true;

    return false;
  }
}
