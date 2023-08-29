import { Request } from 'express';
import { User } from '@root/users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
