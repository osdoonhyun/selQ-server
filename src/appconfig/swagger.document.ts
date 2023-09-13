import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .addBearerAuth()
      .setTitle('QuizShow API')
      .setDescription('The is a QuizShow REST API')
      .setVersion('1.0')
      .build();
  }
}
