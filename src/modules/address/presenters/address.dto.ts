import { IsOptionalNumber } from '@/common/decorators/validators/isOptionalNumber.decorator';
import { IsOptionalString } from '@/common/decorators/validators/isOptionalString.decorator';
import { IsRequiredNumber } from '@/common/decorators/validators/isRequiredNumber.decorator';
import { IsRequiredString } from '@/common/decorators/validators/isRequiredString.decorator';

export class CreateAddressDTO {
   @IsOptionalString()
   public id?: string;

   @IsRequiredString()
   public zipCode: string;

   @IsOptionalString()
   public name: string;

   @IsRequiredString()
   public state: string;

   @IsRequiredString()
   public city: string;

   @IsOptionalString()
   public neighborhood?: string;

   @IsRequiredString()
   public street: string;

   @IsOptionalString()
   public complement?: string;

   @IsRequiredNumber()
   public number: number;

   @IsRequiredString()
   public lat: string;

   @IsRequiredString()
   public lng: string;
}

export class UpdateAddressDTO {
   @IsOptionalString()
   public zipCode?: string;

   @IsOptionalString()
   public name: string;

   @IsOptionalString()
   public state?: string;

   @IsOptionalString()
   public city?: string;

   @IsOptionalString()
   public neighborhood?: string;

   @IsOptionalString()
   public street?: string;

   @IsOptionalString()
   public complement?: string;

   @IsOptionalNumber()
   public number?: number;

   @IsOptionalString()
   public lat?: string;

   @IsOptionalString()
   public lng?: string;
}
