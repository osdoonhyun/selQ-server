import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@root/users/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserList(): Promise<User[]> {
    return await this.usersService.getUserList();
  }

  @Post('email')
  async verifyEmailAddress(@Body('email') email: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    return user;
  }
}
