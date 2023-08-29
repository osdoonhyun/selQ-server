import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDto from '@root/users/dto/create-user.dto';
import { User } from '@root/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.registerUser(createUserDto);
  }
}
