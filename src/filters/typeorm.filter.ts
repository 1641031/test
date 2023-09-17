import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let code = 500;
    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }

    const response = ctx.getResponse();
    // // http 状态码
    // const status = exception.getStatus();
    // this.logger.error(exception.message, exception.stack);

    response.status(500).json({
      code: code,
      timestamp: new Date().toISOString(),
      //   path: request.url,
      //   method: request.method,
      message: exception.message,
    });
  }
}
