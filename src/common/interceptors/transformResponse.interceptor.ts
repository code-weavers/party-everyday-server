import {
   CallHandler,
   ExecutionContext,
   Injectable,
   NestInterceptor,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { NestResponse } from '../core/http/nestResponse';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
   private httpAdapter: AbstractHttpAdapter;

   //if you use Fastify or Express, you can use this method to get the underlying HTTP adapter
   constructor(adapterHost: HttpAdapterHost) {
      this.httpAdapter = adapterHost.httpAdapter;
   }

   intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
   ): Observable<any> | Promise<Observable<any>> {
      return next.handle().pipe(
         map((response: NestResponse) => {
            if (response instanceof NestResponse) {
               const currentContext = context.switchToHttp();
               const currentResponse = currentContext.getResponse();
               const { status, headers, body } = response;

               const headerNames = Object.getOwnPropertyNames(headers);

               headerNames.forEach((headerName) => {
                  const headerValue = headers[headerName];
                  this.httpAdapter.setHeader(
                     currentResponse,
                     headerName,
                     headerValue,
                  );
               });

               this.httpAdapter.status(currentResponse, status);

               return body;
            }

            return response;
         }),
      );
   }
}
