import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@root/users/entities/user.entity';
import { PageOptionsDto } from '@root/common/dtos/page-options.dto';
import { PageDto } from '@root/common/dtos/page.dto';
import { RoleGuard } from '@root/auth/guards /role.guard';
import { Role } from '@root/users/entities/role.enum';
import { UpdateUserDto } from '@root/users/dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
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

  @UseGuards(RoleGuard(Role.ADMIN))
  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }
}
