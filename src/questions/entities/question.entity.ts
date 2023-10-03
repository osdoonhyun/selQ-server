import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { Category } from '@questions/entities/category.enum';
import { Answer } from '@answers/entities/answer.entity';

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

  @OneToMany(() => Answer, (answer: Answer) => answer.question, {
    cascade: true,
  })
  public answers: Answer[];

  @Column('text', { array: true, nullable: true })
  public hints?: string[];
}
