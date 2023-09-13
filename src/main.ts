import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@root/app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { BaseAPIDocument } from '@root/appconfig/swagger.document';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from '@root/common/interfaces/transform.interceptor';
import { HttpExceptionFilter } from '@root/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  app.enableCors();
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const config = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get('SERVER_PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
