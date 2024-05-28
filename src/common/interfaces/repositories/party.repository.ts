import { Party } from '@/entities/party.entity';
import {
   CreatePartyDTO,
   UpdatePartyDTO,
} from '@/modules/party/presenters/party.dto';

export interface IPartyRepository {
   findOne(id: string): Promise<Party>;
   findAll(userId: string): Promise<Party[]>;
   findAllOwner(ownerId: string): Promise<Party[]>;
   create?(party: CreatePartyDTO): Promise<Party>;
   update?(id: string, party: UpdatePartyDTO): Promise<Party>;
   delete?(id: string): Promise<Party>;
}
