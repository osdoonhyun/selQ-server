import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hint } from '@hints/entities/hint.entity';
import { CreateHintDto } from '@hints/dto/create-hint.dto';

@Injectable()
export class HintsService {
  constructor(
    @InjectRepository(Hint)
    private hintRepository: Repository<Hint>,
  ) {}

  async createHint(createHintDto: CreateHintDto): Promise<Hint> {
    const newHint = await this.hintRepository.create(createHintDto);
    await this.hintRepository.save(newHint);
    return newHint;
  }

  async getAllHints(): Promise<Hint[]> {
    const hints = await this.hintRepository.find({
      relations: ['question'],
    });
    return hints;
  }

  async getHintByQuestionId(questionId: string): Promise<Hint> {
    const answer = await this.hintRepository.findOne({
      where: { question: { id: questionId } },
      relations: ['question'], // 관계 엔티티 로드
    });

    if (answer) return answer;
    throw new HttpException(
      'Hint with this questionId does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
