import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('exception', exception);
    const ctx = host.switchToHttp();
    // 响应、请求对象
    const response = ctx.getResponse();
    // console.log('response', response);
    // const request = ctx.getRequest();
    // http 状态码
    const status = exception.getStatus();
    this.logger.error(exception.message, exception.stack);

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      //   path: request.url,
      //   method: request.method,
      message: exception.message || exception.name,
    });
    // throw new Error('Method not implemented.');
  }
}
