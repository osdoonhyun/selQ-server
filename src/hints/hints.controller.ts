import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HintsService } from '@hints/hints.service';
import { Hint } from '@hints/entities/hint.entity';
import { CreateHintDto } from '@hints/dto/create-hint.dto';
@Controller('hints')
export class HintsController {
  constructor(private readonly hintsService: HintsService) {}

  @Post()
  async createAnswer(@Body() createHintDto: CreateHintDto): Promise<Hint> {
    return await this.hintsService.createHint(createHintDto);
  }

  @Get()
  async getAllAnswers(): Promise<Hint[]> {
    return await this.hintsService.getAllHints();
  }

  @Get(':questionId')
  async getHintByQuestionId(
    @Param('questionId') questionId: string,
  ): Promise<Hint> {
    return await this.hintsService.getHintByQuestionId(questionId);
  }
}
