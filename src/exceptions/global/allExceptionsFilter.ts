import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
@Catch()
export class AllExceptionsFilter {
  // constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown | any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    // const { httpAdapter } = this.httpAdapterHost;
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpStatus =
      exception instanceof HttpException
        ? exception?.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception?.code == 11000 && exception?.keyPattern?.email == 1) {
      // Duplicate email error
      exception.response = 'CONFLICT';
      exception.option = {
        cause: 'duplicate email',
        describtion: 'dublicate email',
      };
      exception.statusCode = HttpStatus.CONFLICT;
    }
    const responseBody = {
      success: false,
      timestamp: new Date().toISOString(),
      exception: exception,
    };
    response.status(httpStatus).json(responseBody);
  }
}
