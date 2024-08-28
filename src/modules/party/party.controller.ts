import { DeleteApiResponse } from '@/common/decorators/requests/deleteApiResponse.decorator';
import { GetApiResponse } from '@/common/decorators/requests/getApiResponse.decorator';
import { PostApiResponse } from '@/common/decorators/requests/postApiResponse.decorator';
import { PutApiResponse } from '@/common/decorators/requests/putApiResponse.decorator';
import { IAuth } from '@interfaces/auth.interface';
import { HttpCode, Inject } from '@nestjs/common';
import {
   Body,
   Controller,
   Param,
   Req,
   UploadedFiles,
   UseInterceptors,
} from '@nestjs/common/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FileUtils } from '@utils/file.utils';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { CreateFileDTO } from '../file/presenters/file.dto';
import { PartyModule } from './party.module';
import { AddGuestDTO, CreateAdditionalInfoDTO, CreatePartyDTO, UpdatePartyDTO } from './presenters/party.dto';
import { PartyPresenter } from './presenters/party.presenter';
import { AddGuestsUseCase } from './use-cases/add-guests.usecase';
import { CheckoutUseCase } from './use-cases/checkout.usecase';
import { CreateAdditionalInfoUseCase } from './use-cases/create-additional-info.usecase';
import { CreatePartyUseCase } from './use-cases/create-party.usecase';
import { DeleteAdditionalInfoUseCase } from './use-cases/delete-additional-info.usecase';
import { DeletePartyUseCase } from './use-cases/delete-party.usecase';
import { FindAllGuestPartiesUseCase } from './use-cases/find-all-invited-parties.usecase';
import { FindAllOwnerPartiesUseCase } from './use-cases/find-all-owner-parties.usecase';
import { FindAllPartyUseCase } from './use-cases/find-all-party.usecase';
import { FindOnePartyUseCase } from './use-cases/find-one-party.usecase';
import { RemoveGuestUseCase } from './use-cases/remove-guest.usecase';
import { UpdatePartyFileUseCase } from './use-cases/update-party-file.usecase';
import { UpdatePartyUseCase } from './use-cases/update-party.usecase';

@ApiTags('Parties')
@Controller('parties')
export class PartyController {
   constructor(
      @Inject(PartyModule.FIND_ALL_PARTIES_USECASES_PROXY)
      private readonly findAllPartiesUseCase: UseCaseProxy<FindAllPartyUseCase>,
      @Inject(PartyModule.FIND_ALL_OWNER_PARTIES_USECASES_PROXY)
      private readonly findAllOwnerPartiesUseCase: UseCaseProxy<FindAllOwnerPartiesUseCase>,
      @Inject(PartyModule.FIND_ALL_GUEST_PARTIES_USECASES_PROXY)
      private readonly findAllGuestPartiesUseCase: UseCaseProxy<FindAllGuestPartiesUseCase>,
      @Inject(PartyModule.FIND_PARTY_USECASES_PROXY)
      private readonly findOnePartyUseCase: UseCaseProxy<FindOnePartyUseCase>,
      @Inject(PartyModule.CREATE_PARTY_USECASES_PROXY)
      private readonly createPartyUseCase: UseCaseProxy<CreatePartyUseCase>,
      @Inject(PartyModule.UPDATE_PARTY_USECASES_PROXY)
      private readonly updatePartyUseCase: UseCaseProxy<UpdatePartyUseCase>,
      @Inject(PartyModule.UPDATE_PARTY_FILES_USECASES_PROXY)
      private readonly updatePartyFileUseCase: UseCaseProxy<UpdatePartyFileUseCase>,
      @Inject(PartyModule.DELETE_PARTY_USECASES_PROXY)
      private readonly deletePartyUseCase: UseCaseProxy<DeletePartyUseCase>,
      @Inject(PartyModule.CREATE_ADDITIONAL_INFO_USECASES_PROXY)
      private readonly createAdditionalInfoUseCase: UseCaseProxy<CreateAdditionalInfoUseCase>,
      @Inject(PartyModule.DELETE_ADDITIONAL_INFO_USECASES_PROXY)
      private readonly deleteAdditionalInfoUseCase: UseCaseProxy<DeleteAdditionalInfoUseCase>,
      @Inject(PartyModule.ADD_GUEST_USECASES_PROXY)
      private readonly addGuestUseCase: UseCaseProxy<AddGuestsUseCase>,
      @Inject(PartyModule.REMOVE_GUEST_USECASES_PROXY)
      private readonly removeGuestUseCase: UseCaseProxy<RemoveGuestUseCase>,
      @Inject(PartyModule.CHECKOUT_PARTY_USECASES_PROXY)
      private readonly checkoutUseCase: UseCaseProxy<CheckoutUseCase>,
   ) { }

   @GetApiResponse(PartyPresenter, ':id')
   public async findOneParty(@Param('id') id: string): Promise<PartyPresenter> {
      const party = await this.findOnePartyUseCase.getInstance().execute(id);
      return new PartyPresenter(party);
   }

   @GetApiResponse(PartyPresenter, '', true)
   public async findAllParties(): Promise<PartyPresenter[]> {
      const parties = await this.findAllPartiesUseCase
         .getInstance()
         .execute();

      return parties.map((party) => new PartyPresenter(party));
   }

   @GetApiResponse(PartyPresenter, '/owner/me', true)
   public async findAllOwnerParties(
      @Req() req: IAuth,
   ): Promise<PartyPresenter[]> {
      const parties = await this.findAllOwnerPartiesUseCase
         .getInstance()
         .execute(req.user.id);

      return parties.map((party) => new PartyPresenter(party));
   }

   @GetApiResponse(PartyPresenter, '/invited/:id', true)
   public async findAllInvitedParties(
      @Param('id') id: string,
   ): Promise<PartyPresenter[]> {
      const parties = await this.findAllGuestPartiesUseCase
         .getInstance()
         .execute(id);

      return parties.map((party) => new PartyPresenter(party));
   }

   @PostApiResponse(PartyPresenter, '', false)
   @UseInterceptors(FilesInterceptor('files'))
   public async createParty(
      @Req() currentUser: IAuth,
      @Body() party: CreatePartyDTO,
      @UploadedFiles() files: Express.Multer.File[],
   ): Promise<PartyPresenter> {
      const newFiles: CreateFileDTO[] = await FileUtils.createManyFiles(files);

      party.ownerId = currentUser.user.id;

      const createdParty = await this.createPartyUseCase
         .getInstance()
         .execute(party, newFiles);

      return new PartyPresenter(createdParty);
   }

   @PutApiResponse(PartyPresenter, '/:id')
   public async updateParty(
      @Param('id') id: string,
      @Body() party: UpdatePartyDTO,
   ): Promise<PartyPresenter> {
      const updatedParty = await this.updatePartyUseCase
         .getInstance()
         .execute(id, party);

      return new PartyPresenter(updatedParty);
   }

   @PutApiResponse(PartyPresenter, '/:id/attachments')
   @UseInterceptors(FilesInterceptor('files'))
   public async updatePartyFiles(
      @Param('id') id: string,
      @UploadedFiles() files: Express.Multer.File[],
   ): Promise<PartyPresenter> {
      const newFiles: CreateFileDTO[] = await FileUtils.createManyFiles(files);
      const updatedParty = await this.updatePartyFileUseCase
         .getInstance()
         .execute(id, newFiles);

      return new PartyPresenter(updatedParty);
   }

   @HttpCode(204)
   @DeleteApiResponse('/:id')
   public async deleteParty(@Param('id') id: string): Promise<PartyPresenter> {
      const deletedParty = await this.deletePartyUseCase
         .getInstance()
         .execute(id);

      return new PartyPresenter(deletedParty);
   }

   @PostApiResponse(PartyPresenter, '/:id/additionalInfo')
   public async createAdditionalInfo(
      @Param('id') id: string,
      @Body() additionalInfo: CreateAdditionalInfoDTO,
   ): Promise<PartyPresenter> {
      const createdAdditionalPartyInfo = await this.createAdditionalInfoUseCase
         .getInstance()
         .execute(id, additionalInfo);

      return new PartyPresenter(createdAdditionalPartyInfo);
   }

   @HttpCode(204)
   @DeleteApiResponse('/additionalInfo/:id')
   public async deleteAdditionalInfo(
      @Param('id') id: string,
   ): Promise<PartyPresenter> {
      const deletedAdditionalPartyInfo = await this.deleteAdditionalInfoUseCase
         .getInstance()
         .execute(id);

      return new PartyPresenter(deletedAdditionalPartyInfo);
   }

   @PostApiResponse(PartyPresenter, '/:id/guests')
   public async addGuests(
      @Param('id') id: string,
      @Body() guests: AddGuestDTO,
   ): Promise<PartyPresenter> {
      const addedGuestsParty = await this.addGuestUseCase
         .getInstance()
         .execute(id, guests);

      return new PartyPresenter(addedGuestsParty);
   }

   @HttpCode(204)
   @DeleteApiResponse('/guests/:id')
   public async deleteGuest(
      @Param('id') id: string,
   ): Promise<PartyPresenter> {
      const deletedGuestParty = await this.removeGuestUseCase
         .getInstance()
         .execute(id);

      return new PartyPresenter(deletedGuestParty);
   }

   @PostApiResponse(PartyPresenter, '/:id/checkout')
   public async checkout(@Param('id') id: string): Promise<PartyPresenter> {
      const checkoutedParty = await this.checkoutUseCase
         .getInstance()
         .execute(id);

      return new PartyPresenter(checkoutedParty);
   }
}
