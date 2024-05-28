import { StatusParty } from '@/common/enums/statusParty.enum';
import { UserStatusParty } from '@/common/enums/userStatusParty.enum';
import { AddressPresenter } from '@/modules/address/presenters/address.presenter';
import { FilePresenter } from '@/modules/file/presenters/file.presenter';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class PartyPresenter {
   @ApiProperty()
   public id: string;

   @ApiProperty()
   public ownerId: string;

   @ApiProperty()
   public name: string;

   @ApiProperty()
   public description?: string;

   @ApiProperty({ enum: StatusParty })
   public status?: StatusParty;

   @ApiProperty()
   public date?: Date;

   @ApiProperty()
   public address?: AddressPresenter;

   @ApiProperty()
   public guests?: GuestPresenter[];

   @ApiProperty()
   public files?: FilePresenter[];

   constructor(props: PartyPresenter) {
      this.id = props.id;
      this.ownerId = props.ownerId;
      this.name = props.name;
      this.description = props.description;
      this.status = props.status;
      this.date = new Date(props.date);
      this.address = new AddressPresenter(props.address);
      this.guests = props.guests?.map((guest) => new GuestPresenter(guest));
      this.files = props.files?.map((file) => new FilePresenter(file));
   }
}

export class GuestPresenter {
   @ApiProperty()
   public status: UserStatusParty;

   @ApiProperty()
   public user: UserPresenter;

   constructor(props: GuestPresenter) {
      this.status = props.status;
      this.user = new UserPresenter(props.user);
   }
}
