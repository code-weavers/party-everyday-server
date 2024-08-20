import { Party } from '@/entities/party.entity';
import {
   AddGuestDTO,
   CreateAdditionalInfoDTO,
   CreatePartyDTO,
   UpdatePartyDTO,
} from '@/modules/party/presenters/party.dto';

export interface IPartyRepository {
   findOne(id: string): Promise<Party>;
   findAll(): Promise<Party[]>;
   findAllOwner(ownerId: string): Promise<Party[]>;
   findAllInvited(userId: string): Promise<Party[]>;
   create?(party: CreatePartyDTO): Promise<Party>;
   update?(id: string, party: UpdatePartyDTO): Promise<Party>;
   delete?(id: string): Promise<Party>;
   createAdditionalInfo?(partyId: string, additionalInfo: CreateAdditionalInfoDTO[]): Promise<Party>;
   deleteAdditionalInfo?(additionalInfoId: string): Promise<Party>;
   addGuests?(partyId: string, guests: AddGuestDTO): Promise<Party>;
   deleteGuest?(guestId: string): Promise<Party>;
}
