import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchSelectQueryBuilder } from "./typeormGlobalScopes";
import { ConfigModule } from "@nestjs/config";
import { RequestContextMiddleware } from "./typeormGlobalScopes/requestcontextmiddleware";

ConfigModule.forRoot();
async function bootstrap() {
  patchSelectQueryBuilder();
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
    .addTag('NestJS Template')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = +process.env.BACKEND_PORT;
  app.enableCors();
  app.use(RequestContextMiddleware);

  await app.listen(port);
}

bootstrap();
