import { Controller, Get, Delete, Body, Param, UseInterceptors, Put, Post, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './updateUser.dto';
import { User } from './user.entity';
import { CreateUserDto } from './createUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/multer/multer.config';
import type { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return await this.usersService.getUserById(userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createNewUser(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File): Promise<User> {
    if (file) {
      createUserDto.imagePath = file.filename;
    }
    return await this.usersService.createNewUser(createUserDto);
  }

  @Put(':userId')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateUserById(
    @Param('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.getUserById(userId);

    if (file) {
      if (user.imagePath) {
        const oldImagePath = path.resolve('public', 'uploads', user.imagePath);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateUserDto.imagePath = file.filename;
    }
    return await this.usersService.updateUserById(userId, updateUserDto);
  }

  @Delete(':userId')
  async deleteUserById(@Param('userId') userId: number): Promise<{ success: boolean }> {
    const user = await this.usersService.getUserById(userId);

    if (user.imagePath) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', user.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return await this.usersService.deleteUserById(userId);
  }
}
