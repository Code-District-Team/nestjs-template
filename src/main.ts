import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // whitelist validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
  }));
  // app.useGlobalPipes(validationPipe);


  // swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = +process.env.BACKEND_PORT;
  app.enableCors();
  await app.listen(port);
}
bootstrap();
