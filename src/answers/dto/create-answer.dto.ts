import { IsNotEmpty } from 'class-validator';
import { Question } from '@questions/entities/question.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @IsNotEmpty()
  @ApiProperty()
  answers: string;

  @IsNotEmpty()
  @ApiProperty()
  question: Question;
}
