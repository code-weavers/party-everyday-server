import { IsOptionalModel } from '@/common/decorators/validators/isOptionalModel.decorator';
import { CreateFileDTO } from '@/modules/file/presenters/file.dto';
import { IsOptionalString } from '@decorators/validators/isOptionalString.decorator';
import { IsRequiredString } from '@decorators/validators/isRequiredString.decorator';
import { uuid } from 'uuidv4';

export class UserDTO {
   @IsRequiredString()
   public id?: string;

   @IsOptionalString()
   public username?: string;

   @IsOptionalString()
   public email?: string;

   @IsOptionalString()
   public password?: string;

   @IsOptionalModel([CreateFileDTO])
   public file?: CreateFileDTO;

   constructor(props: UserDTO) {
      Object.assign(this, props);
   }
}

export class CreateUserDTO {
   public id?: string;

   @IsRequiredString()
   public username: string;

   @IsRequiredString()
   public email: string;

   @IsRequiredString()
   public password: string;

   @IsOptionalModel([CreateFileDTO])
   public file?: CreateFileDTO;

   constructor(props: CreateUserDTO) {
      Object.assign(this, props);
      this.id = uuid();
   }
}

export class UpdateUserDTO {
   @IsOptionalString()
   public username?: string;

   @IsOptionalString()
   public email?: string;

   @IsOptionalString()
   public password?: string;

   @IsOptionalModel([CreateFileDTO])
   public file?: CreateFileDTO;
}
