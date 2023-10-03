import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAnswerDto {
  @IsString()
  @IsNotEmpty()
  answers: string;
}
