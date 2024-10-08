import { IsOptionalDate } from '@/common/decorators/validators/isOptionalDate.decorator';
import { IsOptionalModel } from '@/common/decorators/validators/isOptionalModel.decorator';
import { IsOptionalString } from '@/common/decorators/validators/isOptionalString.decorator';
import { IsRequiredDate } from '@/common/decorators/validators/isRequiredDate.decorator';
import { IsRequiredModel } from '@/common/decorators/validators/isRequiredModel.decorator';
import { IsRequiredNumber } from '@/common/decorators/validators/isRequiredNumber.decorator';
import { IsRequiredString } from '@/common/decorators/validators/isRequiredString.decorator';
import { AdditionalInfoType } from '@/common/enums/additionalInfoType.enum';
import { PartyStatus } from '@/common/enums/statusParty.enum';
import { CreateAddressDTO } from '@/modules/address/presenters/address.dto';
import { CreateFileDTO } from '@/modules/file/presenters/file.dto';
import { UserDTO } from '@/modules/user/presenters/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { uuid } from 'uuidv4';

export class CreatePartyDTO {
   public id?: string;

   public ownerId: string;

   @IsRequiredString()
   public name: string;

   @IsOptionalString()
   public description?: string;

   @IsRequiredDate()
   public date: Date;

   @IsOptionalString()
   public addressId?: string;

   @IsOptionalModel([UserDTO])
   public guests?: UserDTO[];

   @IsOptionalModel([CreateFileDTO])
   public files?: CreateFileDTO[];

   @IsRequiredModel([CreateAddressDTO])
   public address: CreateAddressDTO;

   constructor(party: CreatePartyDTO) {
      Object.assign(this, party);
      this.id = uuid();
   }
}

export class UpdatePartyDTO {
   @IsOptionalString()
   public ownerId?: string;

   @IsOptionalString()
   public name?: string;

   @IsOptionalString()
   public description?: string;

   @IsOptionalDate()
   public date?: Date;

   @IsOptionalString()
   public status?: PartyStatus;

   @IsOptionalString()
   public addressId?: string;

   @IsOptionalModel([UserDTO])
   public guests?: UserDTO[];

   @IsOptionalModel([CreateAddressDTO])
   public address?: CreateAddressDTO;

   @IsOptionalModel([CreateFileDTO])
   public files?: CreateFileDTO[];

   constructor(props: UpdatePartyDTO) {
      Object.assign(this, props);
   }
}

export class AdditionalInfoDTO {
   @IsRequiredString()
   public userId: string;

   @IsRequiredString()
   public name: string;

   @IsRequiredNumber()
   public value: number;

   @IsRequiredString()
   public type: AdditionalInfoType;

   constructor(additionalInfo: AdditionalInfoDTO) {
      Object.assign(this, additionalInfo);
   }
}

export class CreateAdditionalInfoDTO {
   @IsNotEmpty()
   @IsArray()
   @ApiProperty()
   public additionalInfo: AdditionalInfoDTO[];

   constructor(additionalInfo: AdditionalInfoDTO[]) {
      Object.assign(this, additionalInfo);
   }
}

export class AddGuestDTO {
   @IsNotEmpty()
   @IsArray()
   @ApiProperty()
   public guests: string[];

   constructor(guests: AddGuestDTO) {
      Object.assign(this, guests);
   }
}