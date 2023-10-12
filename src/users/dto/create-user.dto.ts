import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Provider } from '@root/users/entities/provider.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  //최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 :
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)
  @ApiProperty()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  profileImg?: string;

  @IsString()
  @ApiProperty()
  provider?: Provider;

  @IsBoolean()
  @IsOptional()
  public fourteenOverAgree?: boolean;

  @IsBoolean()
  @IsOptional()
  public termsOfUseAgree?: boolean;

  @IsBoolean()
  @IsOptional()
  public personalInfoAgree?: boolean;

  @IsBoolean()
  @IsOptional()
  public marketingConsent?: boolean;

  @IsBoolean()
  @IsOptional()
  public smsAndEventAgree?: boolean;
}

export default CreateUserDto;
