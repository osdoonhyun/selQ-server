import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const Info = {
  statusCode: 200,
  message: 'success',
};

export type Response<T> = typeof Info & {
  body: T;
};

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<Text, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((body) => Object.assign({}, Info, { body })));
  }
}
