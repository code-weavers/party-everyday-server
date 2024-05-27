import {
   ArgumentsHost,
   Catch,
   ExceptionFilter,
   HttpException,
   HttpStatus,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CustomHttpException implements ExceptionFilter {
   private httpAdapter: AbstractHttpAdapter;

   //if you use Fastify or Express, you can use this method to get the underlying HTTP adapter
   constructor(adapterHost: HttpAdapterHost) {
      this.httpAdapter = adapterHost.httpAdapter;
   }

   catch(exception: Error, host: ArgumentsHost) {
      const context = host.switchToHttp();
      const request = context.getRequest();
      const response = context.getResponse();

      const { status, body } =
         exception instanceof HttpException
            ? {
                 status: exception.getStatus(),
                 body: exception.getResponse(),
              }
            : {
                 status: HttpStatus.INTERNAL_SERVER_ERROR,
                 body: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    message: exception.message,
                 },
              };

      this.httpAdapter.reply(response, body, status);
   }
}
