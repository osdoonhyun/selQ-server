import { User } from '@root/users/entities/user.entity';
import { Question } from '@questions/entities/question.entity';

export class CreateBookmarkDto {
  user: User;
  question: Question;
}
