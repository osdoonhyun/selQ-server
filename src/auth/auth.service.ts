import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '@root/users/users.service';
import { User } from '@root/users/entities/user.entity';
import CreateUserDto from '@root/users/dto/create-user.dto';
import { Provider } from '@root/users/entities/provider.enum';
import { PostgresErrorCode } from '@root/database/postgresErrorCodes.enum';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
