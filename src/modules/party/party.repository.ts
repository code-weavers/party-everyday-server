import { IPartyRepository } from '@/common/interfaces/repositories/party.repository';
import { AdditionalPartyInfo } from '@/entities/additionalPartyInfo.entity';
import { Guest } from '@/entities/guest.entity';
import { Party } from '@/entities/party.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdditionalInfoDTO, CreatePartyDTO, UpdatePartyDTO } from './presenters/party.dto';

@Injectable()
export class PartyRepository implements IPartyRepository {
   constructor(
      @InjectRepository(Party)
      private repository: Repository<Party>,
      @InjectRepository(Guest)
      private guestRepository: Repository<Guest>,
      @InjectRepository(AdditionalPartyInfo)
      private additionalInfoRepository: Repository<AdditionalPartyInfo>
   ) { }

   public async findOne(id: string): Promise<Party> {
      return await this.repository.findOne({
         where: { id },
         relations: ['guests.user', 'address', 'files', 'additionalInfo'],
         order: { date: 'ASC' },
      });
   }

   public async findAll(userId: string): Promise<Party[]> {
      return await this.repository.find({
         where: { ownerId: userId, guests: { id: userId } }, //TODO: Check if this is the correct way to filter the parties
         order: { date: 'ASC' },
      });
   }

   public async findAllOwner(ownerId: string): Promise<Party[]> {
      return await this.repository.find({
         where: { ownerId },
         order: { date: 'ASC' },
      });
   }

   public async findAllGuest(userId: string): Promise<Party[]> {
      return await this.repository.find({
         where: { guests: { userId } },
         order: { date: 'ASC' },
      });
   }

   public async create(party: CreatePartyDTO): Promise<Party> {
      const newParty = this.repository.create(party);

      await this.repository.save(newParty);

      if (newParty.guests?.length > 0)
         for (const user of newParty.guests) {
            const guest = this.guestRepository.create({
               userId: user.id,
               partyId: newParty.id,
            });

            await this.guestRepository.save(guest);
         }

      return newParty;
   }

   public async update(id: string, party: UpdatePartyDTO): Promise<Party> {
      const partyToUpdated = await this.repository.create(party);

      await this.repository.update(id, partyToUpdated);

      //TODO: Implement the update of guests, create a new method in the repository to update the guests
      /*if (partyUpdated.guests && partyUpdated.guests?.length > 0)
         for (const guest of partyUpdated.guests) {
            const guestModel = this.guestRepository.create({
               userId: guest.userId,
               partyId: id,
            });

            await this.guestRepository.save(guestModel);
         }*/

      return await this.findOne(id);
   }

   public async delete(id: string): Promise<Party> {
      const party = await this.findOne(id);

      this.repository.delete({ id });

      return party;
   }

   public async createAdditionalInfo(partyId: string, additionalInfo: CreateAdditionalInfoDTO): Promise<AdditionalPartyInfo> {
      const newAdditionalInfo = this.additionalInfoRepository.create({
         ...additionalInfo,
         partyId,
      });

      return await this.additionalInfoRepository.save(newAdditionalInfo);
   }

   public async deleteAdditionalInfo(id: string): Promise<AdditionalPartyInfo> {
      const additionalInfo = await this.additionalInfoRepository.findOne({ where: { id } });

      await this.additionalInfoRepository.delete({ id });

      return additionalInfo;
   }
}
