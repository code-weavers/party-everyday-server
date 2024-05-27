import { HttpStatus } from '@nestjs/common';
import { NestResponse } from './nestResponse';

export class NestResponseBuilder {
   private response: NestResponse = {
      status: HttpStatus.OK,
      headers: {},
      body: {},
   };

   public withStatus(status: number): NestResponseBuilder {
      this.response.status = status;

      return this;
   }

   public withHeaders(headers: object): NestResponseBuilder {
      this.response.headers = headers;

      return this;
   }

   public withBody(body: object): NestResponseBuilder {
      this.response.body = body;

      return this;
   }

   public build(): NestResponse {
      return new NestResponse(this.response);
   }
}
