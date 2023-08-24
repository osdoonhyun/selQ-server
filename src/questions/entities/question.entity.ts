import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { Category } from '@questions/entities/category.enum';
import { Answer } from '@answers/entities/answer.entity';
import { Hint } from '@hints/entities/hint.entity';

@Entity()
export class Question extends CommonEntity {
  @Column()
  public question: string;

  @Column({
    type: 'enum',
    enum: Category,
    default: Category.React,
  })
  public category: Category;

  @Column({ default: 1 })
  public importance: number;

  @OneToMany(() => Answer, (answer: Answer) => answer.question)
  public answers: Answer[];

  @OneToMany(() => Hint, (hint: Hint) => hint.question)
  public hints: Hint[];
}
