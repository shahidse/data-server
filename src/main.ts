import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exceptions/global/allExceptionsFilter';
import helmet from 'helmet';
import { RequestMethod, VersioningType } from '@nestjs/common';
// import { LogsService } from './modules/logsService/logs.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('hbs');

  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      // { path: '/privacy-policy', method: RequestMethod.GET },
    ],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
  // const { httpAdapter } = (app.get(HttpAdapterHost));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();
  app.use(helmet());
  // app.useLogger(app.get(LogsService));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
}
bootstrap();
