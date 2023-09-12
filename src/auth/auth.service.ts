import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '@root/users/users.service';
import { User } from '@root/users/entities/user.entity';
import CreateUserDto from '@root/users/dto/create-user.dto';
import { Provider } from '@root/users/entities/provider.enum';
import { PostgresErrorCode } from '@root/database/postgresErrorCodes.enum';
import { TokenPayloadInterface } from '@root/auth/interfaces /tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@root/email/email.service';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { UpdateUserDto } from '@root/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async registerUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (err) {
      if (err?.code === PostgresErrorCode.unique_violation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      } else if (err?.code === PostgresErrorCode.not_null_violation) {
        throw new HttpException(
          'Please check not null body value',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(err);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAuthenticatedUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (user.provider !== Provider.LOCAL) {
      throw new HttpException(
        `You cannot login by email to an account that you have subscribed to on ${user.provider}.`,
        HttpStatus.CONFLICT,
      );
    }
    const isPasswordMatched = await user.checkPassword(password);
    if (!isPasswordMatched) {
      console.log(isPasswordMatched);
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  public getCookieWithJWTAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    });
    return token;
    // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
    //   'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    // )}`;
  }

  async initiateEmailAddressVerification(email: string): Promise<boolean> {
    const generateNumber = this.generateOTP();
    await this.cacheManager.set(email, generateNumber);
    await this.emailService.sendMail({
      to: email,
      subject: 'Verification Email Address - selQ',
      text: `The confirmation number is as follows. ${generateNumber}`,
    });
    return true;
  }

  async confirmEmailVerification(
    email: string,
    code: string,
  ): Promise<boolean> {
    const emailCodeByRedis = await this.cacheManager.get(email);
    if (emailCodeByRedis !== code) {
      throw new BadRequestException('Wrong code provided');
    }
    await this.cacheManager.del(email);
    return true;
  }

  generateOTP() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(id, updateUserDto);
  }
}
