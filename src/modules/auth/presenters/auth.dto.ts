import { IsRequiredString } from '../../../common/decorators/validators/isRequiredString.decorator';

export class AuthDTO {
   @IsRequiredString()
   public email: string;

   @IsRequiredString()
   public password: string;

   constructor(props: AuthDTO) {
      Object.assign(this, props);
   }
}

export class PermissionDTO {
   //@IsRequiredString()
   //public role: string;

   @IsRequiredString()
   public pushNotificationToken: string;

   constructor(props: PermissionDTO) {
      Object.assign(this, props);
   }
}