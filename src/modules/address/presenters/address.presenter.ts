import { ApiProperty } from '@nestjs/swagger';

export class AddressPresenter {
   @ApiProperty()
   public id: string;

   @ApiProperty({ required: false })
   public name?: string;

   @ApiProperty()
   public zipCode: string;

   @ApiProperty()
   public state: string;

   @ApiProperty()
   public city: string;

   @ApiProperty()
   public neighborhood: string;

   @ApiProperty()
   public street: string;

   @ApiProperty({ required: false })
   public complement?: string;

   @ApiProperty()
   public number: number;

   @ApiProperty()
   public lat: string;

   @ApiProperty()
   public lng: string;

   constructor(props: AddressPresenter) {
      Object.assign(this, props);
   }
}
