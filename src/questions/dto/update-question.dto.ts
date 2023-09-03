import { Category } from '@questions/entities/category.enum';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuestionDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    question: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    importance: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    category: Category;

    @ApiProperty()
    @IsOptional()
    hints?: string[];
}