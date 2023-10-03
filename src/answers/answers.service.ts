import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '@answers/entities/answer.entity';
import { CreateAnswerDto } from '@answers/dto/create-answer.dto';
import { UpdateAnswerDto } from '@answers/dto/update-answer.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  async createAnswer(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    const newAnswer = await this.answerRepository.create(createAnswerDto);
    await this.answerRepository.save(newAnswer);
    return newAnswer;
  }

  async getAllAnswers(): Promise<Answer[]> {
    const answers = await this.answerRepository.find({
      relations: ['question'],
    });
    return answers;
  }

  async getAnswerByQuestionId(questionId: string): Promise<Answer> {
    const answer = await this.answerRepository.findOne({
      where: { question: { id: questionId } },
      relations: ['question'], // 관계 엔티티 로드
    });

    if (answer) return answer;
    throw new HttpException(
      'Answer with this questionId does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async updateAnswer(
    id: string,
    updateAnswerDto: UpdateAnswerDto,
  ): Promise<Answer> {
    await this.answerRepository.update(id, updateAnswerDto);
    const updatedAnswer = await this.answerRepository.findOneBy({ id });
    if (updatedAnswer) return updatedAnswer;
    throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
  }
}
