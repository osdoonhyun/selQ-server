import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { Provider } from '@root/users/entities/provider.enum';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@root/auth/auth.service';
import { UsersService } from '@root/users/users.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  Strategy,
  Provider.GOOGLE,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENTID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { provider, displayName, email, picture } = profile;
    console.log(profile);
    try {
      // Profile 이메일이 데이터베이스에 존재하면 로그인,
      const user = await this.usersService.getUserByEmail(email);

      if (user.provider !== provider) {
        throw new HttpException(
          `You are already subscribed to ${user.provider}.`,
          HttpStatus.CONFLICT,
        );
      }
      console.log('+++++++++++++++++++');
      done(null, user);
    } catch (err) {
      console.log('----------------------', err.status);
      if (err.status === 404) {
        const newUser = await this.usersService.createUser({
          email,
          username: displayName,
          provider,
          profileImg: picture,
        });
        done(null, newUser);
      }
    }
  }
}
