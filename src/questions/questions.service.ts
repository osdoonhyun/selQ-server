import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '@questions/entities/question.entity';
import { CreateQuestionDto } from '@questions/dto/create-question.dto';
import { PageDto } from '@root/common/dtos/page.dto';
import { PageMetaDto } from '@root/common/dtos/page-meta.dto';
import { PageOptionsDto } from '@root/common/dtos/page-options.dto';
import { Category } from '@questions/entities/category.enum';
import { UpdateQuestionDto } from '@questions/dto/update-question.dto';

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
    importance?: number[],
    category?: Category[],
  ): Promise<PageDto<Question>> {
    const queryBuilder = await this.questionRepository.createQueryBuilder(
      'questions',
    );

    queryBuilder.leftJoinAndSelect('questions.answers', 'answers');

    if (importance !== undefined) {
      if (Array.isArray(importance)) {
        // Handle multiple importance values
        queryBuilder.andWhere('questions.importance IN (:...importance)', {
          importance,
        });
      } else {
        // Handle a single importance value
        queryBuilder.andWhere('questions.importance = :importance', {
          importance,
        });
      }
    }

    if (category !== undefined) {
      if (Array.isArray(category)) {
        // Handle multiple category values
        queryBuilder.andWhere('questions.category IN (:...category)', {
          category,
        });
      } else {
        // Handle a single category value
        queryBuilder.andWhere('questions.category = :category', {
          category,
        });
      }
    }

    await queryBuilder
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
      relations: ['answers'],
    });
    if (question) return question;
    throw new HttpException(
      'Question with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async updateQuestion(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    await this.questionRepository.update(id, updateQuestionDto);
    const updatedPost = await this.questionRepository.findOneBy({ id });
    if (updatedPost) return updatedPost;
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const deleteResponse = await this.questionRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return true;
  }
}
