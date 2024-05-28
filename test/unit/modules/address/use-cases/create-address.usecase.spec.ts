import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { CreateAddressUseCase } from '@/modules/address/use-cases/create-address.usecase';
import { createMock } from '@golevelup/ts-jest';
import { address, createAddressDTO } from '../../../mocks/address.mock';

describe('CreateAddressUseCase', () => {
   let createAddressUseCase: CreateAddressUseCase;
   let addressRepository: IAddressRepository;
   let logger: ILogger;

   beforeEach(async () => {
      addressRepository = createMock<IAddressRepository>({
         create: jest.fn(),
      });

      logger = createMock<ILogger>({
         log: jest.fn(),
      });

      createAddressUseCase = new CreateAddressUseCase(
         addressRepository,
         logger,
      );
   });

   it('should be defined', () => {
      expect(createAddressUseCase).toBeDefined();
   });

   it('should create an address', async () => {
      jest.spyOn(addressRepository, 'create').mockResolvedValue(address);

      const result = await createAddressUseCase.execute(createAddressDTO);

      expect(result).toEqual(address);

      expect(logger.log).toHaveBeenCalledWith(
         'CreateAddressUseCase execute()',
         `New address ${address.street}, ${address.number} - ${address.city} - ${address.state} have been inserted`,
      );
   });
});
