import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { Provider } from '@root/users/entities/provider.enum';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { Role } from '@root/users/entities/role.enum';
import { Exclude } from 'class-transformer';
import { stringify } from 'ts-jest';

@Entity()
export class User extends CommonEntity {
  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  @Exclude()
  public password?: string;

  @Column({ nullable: true })
  public profileImg?: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  public roles: Role[];

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ default: false })
  public fourteenOverAgree: boolean;

  @Column({ default: false })
  public termsOfUseAgree: boolean;

  @Column({ default: false })
  public personalInfoAgree: boolean;

  @Column({ default: false })
  public marketingConsent: boolean;

  @Column({ default: false })
  public smsAndEventAgree: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async beforeSaveFunction(): Promise<void> {
    try {
      if (this.provider !== Provider.LOCAL) {
        return;
      } else {
        // generate number of UserId

        //프로필 이미지 자동생성
        this.profileImg = gravatar.url(this.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
          protocol: 'https',
        });

        // 패스워드 암호화
        const saltValue = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltValue);
      }
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
