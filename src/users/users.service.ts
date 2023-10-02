import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@root/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@root/users/dto/create-user.dto';
import { PageOptionsDto } from '@root/common/dtos/page-options.dto';
import { PageMetaDto } from '@root/common/dtos/page-meta.dto';
import { PageDto } from '@root/common/dtos/page.dto';
import { UpdateUserDto } from '@root/users/dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Answer } from '@answers/entities/answer.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserList(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = await this.usersRepository.createQueryBuilder('users');
    queryBuilder
      .orderBy('users.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) return user;
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) return user;
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    if (updatedUser) return updatedUser;
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: string) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
