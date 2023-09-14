import { Module } from '@nestjs/common';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { DatabaseModule } from '@root/database/database.module';
import { QuestionsModule } from '@questions/questions.module';
import { AnswersModule } from '@answers/answers.module';
import { AppconfigModule } from '@root/appconfig/appconfig.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    AppconfigModule,
    DatabaseModule,
    QuestionsModule,
    AnswersModule,
    AppconfigModule,
    UsersModule,
    AuthModule,
    EmailModule,
    RedisModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
