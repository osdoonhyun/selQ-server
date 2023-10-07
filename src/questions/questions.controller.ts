import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from '@questions/questions.service';
import { CreateQuestionDto } from '@questions/dto/create-question.dto';
import { Question } from '@questions/entities/question.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '@root/common/dtos/page-options.dto';
import { PageDto } from '@root/common/dtos/page.dto';
import { Category } from '@questions/entities/category.enum';
import { FindOneParams } from '@questions/entities/findOneParams';
import { UpdateQuestionDto } from '@questions/dto/update-question.dto';
import { RoleGuard } from '@root/auth/guards /role.guard';
import { Role } from '@root/users/entities/role.enum';
import { number } from '@hapi/joi';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(RoleGuard(Role.ADMIN))
  @Post()
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return await this.questionsService.createQuestion(createQuestionDto);
  }

  @Get()
  @ApiQuery({ name: 'importance', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  async getAllQuestions(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('importance') importance?: number[],
    @Query('category') category?: Category[],
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

  @UseGuards(RoleGuard(Role.ADMIN))
  @Patch(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    return await this.questionsService.updateQuestion(id, updateQuestionDto);
  }

  @UseGuards(RoleGuard(Role.ADMIN))
  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams): Promise<boolean> {
    return this.questionsService.deleteQuestion(id);
  }
}
