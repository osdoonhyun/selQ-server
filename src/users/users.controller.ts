import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@root/users/entities/user.entity';
import { PageOptionsDto } from '@root/common/dtos/page-options.dto';
import { PageDto } from '@root/common/dtos/page.dto';
import { Question } from '@questions/entities/question.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserList(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return await this.usersService.getUserList(pageOptionsDto);
  }

  @Post('email')
  async verifyEmailAddress(@Body('email') email: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    return user;
  }
}
