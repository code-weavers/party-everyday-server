export class NestResponse {
   public status: number;
   public headers: object;
   public body: object;

   constructor(response: NestResponse) {
      Object.assign(this, response);
   }
}
