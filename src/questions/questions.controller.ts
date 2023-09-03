import {
  Body,
  Controller, Delete,
  Get,
  Param,
  ParseArrayPipe, Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionsService } from '@questions/questions.service';
import { CreateQuestionDto } from '@questions/dto/create-question.dto';
import { Question } from '@questions/entities/question.entity';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '@root/common/dtos/page-options.dto';
import { PageDto } from '@root/common/dtos/page.dto';
import { Category } from '@questions/entities/category.enum';
import { FindOneParams } from "@questions/entities/findOneParams";
import { UpdateQuestionDto } from "@questions/dto/update-question.dto";

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return await this.questionsService.createQuestion(createQuestionDto);
  }

  @Get()
  async getAllQuestions(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('importance') importance?: number,
    @Query('category') category?: Category,
  ): Promise<PageDto<Question>> {
    return await this.questionsService.getAllQuestions(
      pageOptionsDto,
      importance,
      category,
    );
  }
  @Get(':id')
  async getQuestionById(@Param() { id }: FindOneParams): Promise<Question> {
    return await this.questionsService.getQuestionById(id);
  }

  @Patch(':id')
  async updateQuestion(
      @Param() {id}: FindOneParams,
      @Body() updateQuestionDto: UpdateQuestionDto
  ): Promise<Question> {
    return await this.questionsService.updateQuestion(id, updateQuestionDto)
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams): Promise<boolean> {
    return this.questionsService.deleteQuestion(id);
  }

}
