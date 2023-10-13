import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LogInUserDto } from '@root/users/dto/logIn-user.dto';
import { GoogleAuthGuard } from '@root/auth/guards /google-auth.guard';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'the record has been seccuess',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'forbidden' })
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.registerUser(createUserDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ status: 200, description: 'login success' })
  @ApiResponse({ status: 401, description: 'forbidden' })
  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
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
  @ApiResponse({ status: 200, description: 'email verification send success' })
  @ApiResponse({ status: 401, description: 'forbidden' })
  @ApiOperation({
    summary: 'email 인증 전송 성공',
    description: 'email 인증 전송 성공',
  })
  async initiateEmailAddressVerification(
    @Body('email') email: string,
  ): Promise<boolean> {
    return await this.authService.initiateEmailAddressVerification(email);
  }

  @Post('email/check')
  @ApiResponse({
    status: 200,
    description: 'email verification confirm success',
  })
  @ApiResponse({ status: 401, description: 'forbidden' })
  @ApiOperation({
    summary: 'email 인증 확인 성공',
    description: 'email 인증 확인 성공',
  })
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

  @HttpCode(200)
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @HttpCode(200)
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<any> {
    const { user } = req;
    const accessTokenCookie = this.authService.getCookieWithJWTAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJWTRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    const mainPageUrl = 'http://localhost:3000';
    res.send(
      `<script>window.opener.postMessage('loginComplete', '${mainPageUrl}');window.close();</script>`,
    );
    return user;
  }
}
