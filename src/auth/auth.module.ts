import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@root/users/users.module';
import { LocalAuthStrategy } from '@root/auth/strategies/local-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from '@root/auth/strategies/jwt-access-token.strategy';
import { EmailModule } from '@root/email/email.module';
import { JwtRefreshTokenStrategy } from '@root/auth/strategies/jwt-refresh-token.strategy';
import { GoogleAuthStrategy } from '@root/auth/strategies/google-auth.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    UsersModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    GoogleAuthStrategy,
  ],
})
export class AuthModule {}
