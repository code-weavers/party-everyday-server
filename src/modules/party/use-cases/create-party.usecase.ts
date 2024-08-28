import { IGatewayService } from '@/common/interfaces/abstracts/gateway.service';
import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { IUserRepository } from '@/common/interfaces/repositories/user.repository';
import { Party } from '@/entities/party.entity';
import { OwnerType } from '@enums/ownerType.enum';
import { IEnvironmentConfigService } from '@interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { IFileRepository } from '@interfaces/repositories/file.repository';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { CreateFileDTO } from '@modules/file/presenters/file.dto';
import { CreatePartyDTO } from '../presenters/party.dto';

export class CreatePartyUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
      private readonly fileRepository: IFileRepository,
      private readonly addressRepository: IAddressRepository,
      private readonly userRepository: IUserRepository,
      private readonly uploadService: IUploadService,
      private readonly environmentConfig: IEnvironmentConfigService,
      private readonly gatewayService: IGatewayService,
   ) { }

   public async execute(
      party: CreatePartyDTO,
      files?: CreateFileDTO[],
   ): Promise<Party> {

      this.logger.log(' CreatePartyUseCases execute()', `Creating new party with params: ${JSON.stringify(party)}`)

      if (files) party.files = await this.createFiles(party.id, files);

      const address = await this.addressRepository.create(party.address);

      party.addressId = address.id;

      await this.repository.create(party);

      if (party.guests.length > 0) {
         for (const guest of party.guests) {
            const user = await this.userRepository.findOne(guest.id);

            this.gatewayService.sendNotification({
               pushToken: user.pushNotificationToken,
               partyId: party.id,
               title: `${party.name}`,
               message: `Você está convidado para o evento ${party.name}!`
            });
         }
      }

      this.logger.log(
         'CreatePartyUseCases execute()',
         'New party have been created',
      );

      return this.repository.findOne(party.id);
   }

   private async createFiles(
      id: string,
      files: CreateFileDTO[],
   ): Promise<CreateFileDTO[]> {
      if (this.environmentConfig.getCloudUpload()) {
         for (const file of files) {
            const fileUploaded = await this.uploadService.uploadFile(file);
            file.url = fileUploaded.url;
         }
      }

      for (const file of files) {
         await this.fileRepository.create(file, id, OwnerType.PARTY);
      }

      return files;
   }
}
