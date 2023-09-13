import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
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
import { UpdateUserDto } from '@root/users/dto/update-user.dto';
import { UsersService } from '@root/users/users.service';
import JwtRefreshGuard from '@root/auth/guards /jwt-refresh.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LogInUserDto } from '@root/users/dto/logIn-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.registerUser(createUserDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LogInUserDto })
  async logIn(@Req() req: RequestWithUser) {
    const { user } = req;
    const accessTokenCookie = this.authService.getCookieWithJWTAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJWTRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async getRefreshToken(@Req() req: RequestWithUser) {
    const { user } = req;
    const accessTokenCookie =
      await this.authService.getCookieWithJWTAccessToken(user.id);
    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return user;
  }

  @Post('email/send')
  async initiateEmailAddressVerification(
    @Body('email') email: string,
  ): Promise<boolean> {
    return await this.authService.initiateEmailAddressVerification(email);
  }

  @Post('email/check')
  async checkEmail(
    @Body('email') email: string,
    @Body('code') code: string,
  ): Promise<boolean> {
    return await this.authService.confirmEmailVerification(email, code);
  }

  @UseGuards(JwtAccessGuard)
  @Patch('update')
  async updateMySelf(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAccessGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() req: RequestWithUser) {
    const { user } = req;
    await this.usersService.removeRefreshToken(user.id);
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  authenticate(@Req() req: RequestWithUser) {
    return req.user;
  }
}
