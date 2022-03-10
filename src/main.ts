import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { RequestContextMiddleware } from "./middlewares/requestContext.middleware";
import { patchSelectQueryBuilder } from "./typeormGlobalScopes/patch-select-query-builder";

async function bootstrap() {
  patchSelectQueryBuilder();
  const app = await NestFactory.create(AppModule);

  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });
  app.enableCors();
  app.setGlobalPrefix("api");
  app.use(RequestContextMiddleware);
  await app.listen(8088);
}
bootstrap();
