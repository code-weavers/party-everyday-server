import { OwnerType } from '@/common/enums/ownerType.enum';
import { IsOptionalString } from '@decorators/validators/isOptionalString.decorator';

export class CreateFileDTO {
   @IsOptionalString()
   public ownerId?: string;

   @IsOptionalString()
   public ownerType?: OwnerType;

   @IsOptionalString()
   public fieldname?: string;

   @IsOptionalString()
   public originalname?: string;

   @IsOptionalString()
   public encoding?: string;

   @IsOptionalString()
   public mimetype?: string;

   @IsOptionalString()
   public key?: string;

   @IsOptionalString()
   public url?: string;

   @IsOptionalString()
   public buffer?: Uint8Array;

   constructor(props: CreateFileDTO) {
      Object.assign(this, props);
   }
}
