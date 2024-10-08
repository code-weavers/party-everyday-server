import { FilePresenter } from '@/modules/file/presenters/file.presenter';
import { IsRequiredString } from '@decorators/validators/isRequiredString.decorator';

export class AuthPresenter {
   @IsRequiredString()
   public id: string;

   @IsRequiredString()
   public email: string;

   @IsRequiredString()
   public username: string;

   @IsRequiredString()
   public telephoneNumber: string;

   @IsRequiredString()
   public pushNotificationToken: string;

   @IsRequiredString()
   public billingAccountKey: string;

   @IsRequiredString()
   public accessToken: string;

   public file: FilePresenter;

   constructor(auth: AuthPresenter) {
      this.id = auth.id;
      this.email = auth.email;
      this.username = auth.username;
      this.telephoneNumber = auth.telephoneNumber;
      this.pushNotificationToken = auth.pushNotificationToken;
      this.billingAccountKey = auth.billingAccountKey;
      this.accessToken = auth.accessToken;
      this.file = new FilePresenter(auth.file);
   }
}
