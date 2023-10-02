import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnswersService } from '@answers/answers.service';
import { CreateAnswerDto } from '@answers/dto/create-answer.dto';
import { Answer } from '@answers/entities/answer.entity';
import { UpdateAnswerDto } from '@answers/dto/update-answer.dto';
import { RoleGuard } from '@root/auth/guards /role.guard';
import { Role } from '@root/users/entities/role.enum';

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

  @UseGuards(RoleGuard(Role.ADMIN))
  @Patch(':id')
  async updateAnswerById(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ): Promise<Answer> {
    return await this.answersService.updateAnswer(id, updateAnswerDto);
  }
}
