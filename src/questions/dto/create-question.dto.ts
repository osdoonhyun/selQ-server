import { Category } from '@questions/entities/category.enum';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  question: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  importance: number;

  @IsNotEmpty()
  @ApiProperty()
  category: Category;

  @ApiProperty()
  hints?: string[];
}
