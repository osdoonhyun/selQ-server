import { Injectable } from '@nestjs/common';
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
    console.log(profile);
  }
}
