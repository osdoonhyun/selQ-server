import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '@questions/entities/question.entity';
import { CreateQuestionDto } from '@questions/dto/create-question.dto';
import { PageDto } from '@root/common/dtos/page.dto';
import { PageMetaDto } from '@root/common/dtos/page-meta.dto';
import { PageOptionsDto } from '@root/common/dtos/page-options.dto';
import { Category } from '@questions/entities/category.enum';

@Injectable()
export class QuestionsService {
  @InjectRepository(Question)
  private questionRepository: Repository<Question>;

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const newQuestion = await this.questionRepository.create(createQuestionDto);
    await this.questionRepository.save(newQuestion);
    return newQuestion;
  }

  async getAllQuestions(
    pageOptionsDto: PageOptionsDto,
    importance?: number,
    category?: Category,
  ): Promise<PageDto<Question>> {
    const queryBuilder = await this.questionRepository.createQueryBuilder(
      'questions',
    );

    queryBuilder
      .leftJoinAndSelect('questions.answers', 'answers')
      .leftJoinAndSelect('questions.hints', 'hints');

    if (importance) {
      queryBuilder.where('questions.importance = :importance', { importance });
    }

    if (category) {
      queryBuilder.where('questions.category = :category', { category });
    }

    queryBuilder
      .orderBy('questions.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async getQuestionById(id: string): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['answers', 'hints'],
    });
    if (question) return question;
    throw new HttpException(
      'Question with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
