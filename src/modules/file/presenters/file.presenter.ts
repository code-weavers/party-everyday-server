import { ApiProperty } from '@nestjs/swagger';

export class FilePresenter {
   @ApiProperty()
   public fieldname?: string;

   @ApiProperty()
   public originalname?: string;

   @ApiProperty()
   public url?: string;

   @ApiProperty()
   public key?: string;

   constructor(props: FilePresenter) {
      this.fieldname = props?.fieldname ?? props?.key;
      this.originalname = props?.originalname;
      this.url = props?.url;
   }
}
