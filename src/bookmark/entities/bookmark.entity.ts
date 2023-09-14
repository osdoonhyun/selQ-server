import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { User } from '@root/users/entities/user.entity';
import { Question } from '@questions/entities/question.entity';

@Entity()
export class Bookmark extends CommonEntity {
  @ManyToOne(() => User, (user) => user.bookmarks)
  public user: User;

  @ManyToOne(() => Question)
  @JoinColumn()
  public question: Question;
}
