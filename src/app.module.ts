import { Module } from '@nestjs/common';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { DatabaseModule } from '@root/database/database.module';
import { QuestionsModule } from '@questions/questions.module';
import { AnswersModule } from '@answers/answers.module';
import { HintsModule } from '@hints/hints.module';
import { AppconfigModule } from '@root/appconfig/appconfig.module';

@Module({
  imports: [
    AppconfigModule,
    DatabaseModule,
    QuestionsModule,
    AnswersModule,
    HintsModule,
    AppconfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
