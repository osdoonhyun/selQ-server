import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDto from '@root/users/dto/create-user.dto';
import { User } from '@root/users/entities/user.entity';
import { LocalAuthGuard } from '@root/auth/guards /local-auth.guard';
import { RequestWithUser } from '@root/auth/interfaces /requestWithUser.interface';
import { JwtAccessGuard } from '@root/auth/guards /jwt-access.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.registerUser(createUserDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() req: RequestWithUser) {
    const { user } = req;
    const token = this.authService.getCookieWithJWTAccessToken(user.id);
    return { user, token };
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  authenticate(@Req() req: RequestWithUser): User {
    return req.user;
  }
}
