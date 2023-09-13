import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { createLogger } from 'winston';

// import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { AllExceptionFilter } from './filters/all-exception.filter';
// import winston from 'winston/lib/winston/config';
// import { Logger } from '@nestjs/common';

async function bootstrap() {
  // const logger = new Logger();
  // const instance = createLogger({
  //   // options of Winston
  //   transports: [],
  // });
  // const logger = WinstonModule.createLogger({
  //   instance,
  // });

  const app = await NestFactory.create(AppModule, {
    // 关闭了整个 nestjs的日志
    // logger: false,
    // logger: ['error', 'warn'],
    // logger: WinstonModule.createLogger({
    //   instance,
    // }),
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');

  // const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new HttpExceptionFilter(logger));
  // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));
  const port = 3000;
  await app.listen(port);
  // logger.warn(`App 运行在: ${port}`);
}
bootstrap();
