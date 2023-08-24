import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnswersService } from '@answers/answers.service';
import { CreateAnswerDto } from '@answers/dto/create-answer.dto';
import { Answer } from '@answers/entities/answer.entity';

@Controller('answers')
@ApiTags('Answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  async createAnswer(
    @Body() createAnswerDto: CreateAnswerDto,
  ): Promise<Answer> {
    return await this.answersService.createAnswer(createAnswerDto);
  }

  @Get()
  async getAllAnswers(): Promise<Answer[]> {
    return await this.answersService.getAllAnswers();
  }

  @Get(':questionId')
  async getAnswerByQuestionId(
    @Param('questionId') questionId: string,
  ): Promise<Answer> {
    return await this.answersService.getAnswerByQuestionId(questionId);
  }
}
