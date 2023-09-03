import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@root/users/users.module';
import { LocalAuthStrategy } from '@root/auth/strategies/local-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from '@root/auth/strategies/jwt-access_token.strategy';

@Module({
  imports: [PassportModule, ConfigModule, JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, JwtAccessTokenStrategy],
})
export class AuthModule {}
