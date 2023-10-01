import { Module } from '@nestjs/common';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { DatabaseModule } from '@root/database/database.module';
import { QuestionsModule } from '@questions/questions.module';
import { AnswersModule } from '@answers/answers.module';
import { AppconfigModule } from '@root/appconfig/appconfig.module';
import { AuthModule } from '@root/auth/auth.module';
import { UsersModule } from '@root/users/users.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    AppconfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    QuestionsModule,
    AnswersModule,
    EmailModule,
    RedisModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
