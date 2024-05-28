import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { UpdateAddressUseCase } from '@/modules/address/use-cases/update-address.usecase';
import { createMock } from '@golevelup/ts-jest';
import { address, updateAddressDTO } from '../../../mocks/address.mock';

describe('UpdateAddressUseCase', () => {
   let updateAddressUseCase: UpdateAddressUseCase;
   let addressRepository: IAddressRepository;
   let logger: ILogger;

   beforeEach(() => {
      addressRepository = createMock<IAddressRepository>({
         update: jest.fn(),
      });

      logger = createMock<ILogger>({
         log: jest.fn(),
      });

      updateAddressUseCase = new UpdateAddressUseCase(
         addressRepository,
         logger,
      );
   });

   it('should update an address and log the update', async () => {
      jest.spyOn(addressRepository, 'update').mockResolvedValue(address);

      const result = await updateAddressUseCase.execute('1', updateAddressDTO);

      expect(addressRepository.update).toHaveBeenCalledWith(
         '1',
         updateAddressDTO,
      );

      expect(logger.log).toHaveBeenCalledWith(
         'UpdateAddressUseCase execute()',
         `Address ${address.street}, ${address.number} - ${address.city} - ${address.state} have been updated`,
      );

      expect(result).toEqual(address);
   });
});
