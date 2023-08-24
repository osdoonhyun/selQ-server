import { Module } from '@nestjs/common';
import { AnswersService } from '@answers/answers.service';
import { AnswersController } from '@answers/answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '@answers/entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
