import { IAuth } from '@/common/interfaces/auth.interface';
import { FileUtils } from '@/common/utils/file.utils';
import { Party } from '@/entities/party.entity';
import { PartyController } from '@/modules/party/party.controller';
import { PartyModule } from '@/modules/party/party.module';
import { PartyPresenter } from '@/modules/party/presenters/party.presenter';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { multerFile } from '../../mocks/file.mock';
import {
   createPartyDTO,
   partyList,
   updatePartyDTO,
} from '../../mocks/party.mock';

describe('PartyController', () => {
   let partyController: PartyController;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [PartyController],
         providers: [
            {
               provide: PartyModule.FIND_PARTY_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: PartyModule.FIND_ALL_PARTIES_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: PartyModule.FIND_ALL_OWNER_PARTIES_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: PartyModule.CREATE_PARTY_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: PartyModule.UPDATE_PARTY_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: PartyModule.UPDATE_PARTY_FILES_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: PartyModule.DELETE_PARTY_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
         ],
      })
         .useMocker(() => createMock())
         .compile();

      partyController = module.get<PartyController>(PartyController);
   });

   it('should be defined', () => {
      expect(partyController).toBeDefined();
   });

   describe('findOneParty', () => {
      it('should find one party using the findOneParty method', async () => {
         const mockParty = new Party();
         const mockId = '1';

         jest
            .spyOn(
               partyController['findOnePartyUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(mockParty);

         const result = await partyController.findOneParty(mockId);

         expect(result).toBeInstanceOf(PartyPresenter);
         expect(
            partyController['findOnePartyUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockId);
      });
   });

   describe('findAllParties', () => {
      it('should return all parties', async () => {
         const mockReq = { user: { id: '1', username: '' } };
         const mockParties = partyList.map(
            (party) => new PartyPresenter(party),
         );

         jest
            .spyOn(
               partyController['findAllPartiesUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(partyList);

         const result = await partyController.findAllParties(mockReq);

         expect(result).toEqual(mockParties);
         expect(
            partyController['findAllPartiesUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith('1');
      });
   });

   describe('findAllOwnerParties', () => {
      it('should find all owner parties using the findAllOwnerParties method', async () => {
         const mockReq = { user: { id: '1', username: '' } };

         jest
            .spyOn(
               partyController['findAllOwnerPartiesUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(partyList);

         const result = await partyController.findAllOwnerParties(mockReq);

         expect(result).toBeInstanceOf(Array);
         result.forEach((party) =>
            expect(party).toBeInstanceOf(PartyPresenter),
         );
         expect(
            partyController['findAllOwnerPartiesUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith('1');
      });
   });

   describe('findAllGuestParties', () => {
      it('should find all guest parties using the findAllGuestParties method', async () => {
         jest
            .spyOn(
               partyController['findAllGuestPartiesUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(partyList);

         const result = await partyController.findAllGuestParties('1');

         expect(result).toBeInstanceOf(Array);
         result.forEach((party) =>
            expect(party).toBeInstanceOf(PartyPresenter),
         );
         expect(
            partyController['findAllGuestPartiesUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith('1');
      });
   });

   describe('createParty', () => {
      it('should create a party and return an instance of PartyPresenter', async () => {
         const auth: IAuth = { user: { id: '1', username: 'testUser' } };
         const mockFiles: Express.Multer.File[] = [multerFile];
         const mockParty = new Party();

         jest.spyOn(FileUtils, 'createManyFiles').mockResolvedValue(mockFiles);
         jest
            .spyOn(
               partyController['createPartyUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(mockParty);

         const result = await partyController.createParty(
            auth,
            createPartyDTO,
            mockFiles,
         );

         expect(result).toBeInstanceOf(PartyPresenter);
         expect(FileUtils.createManyFiles).toHaveBeenCalledWith(mockFiles);
         expect(
            partyController['createPartyUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(createPartyDTO, mockFiles);
      });
   });

   describe('updateParty', () => {
      it('should update a party and return an instance of PartyPresenter', async () => {
         const mockId = '1';

         jest
            .spyOn(
               partyController['updatePartyUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(new Party());

         const result = await partyController.updateParty(
            mockId,
            updatePartyDTO,
         );

         expect(result).toBeInstanceOf(PartyPresenter);
         expect(
            partyController['updatePartyUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockId, updatePartyDTO);
      });
   });

   describe('updatePartyFiles', () => {
      it('should update party files', async () => {
         const mockId = '1';
         const mockFiles: Express.Multer.File[] = [multerFile];
         const mockParty = new Party();

         jest.spyOn(FileUtils, 'createManyFiles').mockResolvedValue(mockFiles);
         jest
            .spyOn(
               partyController['updatePartyFileUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(mockParty);

         const result = await partyController.updatePartyFiles(
            mockId,
            mockFiles,
         );

         expect(result).toBeInstanceOf(PartyPresenter);
         expect(FileUtils.createManyFiles).toHaveBeenCalledWith(mockFiles);
         expect(
            partyController['updatePartyFileUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockId, mockFiles);
      });
   });

   describe('deleteParty', () => {
      it('should delete a party', async () => {
         const mockParty = new Party();
         const mockId = '1';

         jest
            .spyOn(
               partyController['deletePartyUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(mockParty);

         const result = await partyController.deleteParty(mockId);

         expect(result).toBeInstanceOf(PartyPresenter);
         expect(
            partyController['deletePartyUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockId);
      });
   });
});
