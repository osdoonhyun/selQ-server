import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Question } from '@questions/entities/question.entity';

export class CreateHintDto {
  @IsNotEmpty()
  @ApiProperty()
  hints: string[];

  @IsNotEmpty()
  @ApiProperty()
  question: Question;
}
