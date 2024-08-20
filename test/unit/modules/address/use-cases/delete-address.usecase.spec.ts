import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { DeleteAddressUseCase } from '@/modules/address/use-cases/delete-address.usecase';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { address } from '../../../mocks/address.mock';

describe('DeleteAddressUseCase', () => {
   let deleteAddressUseCase: DeleteAddressUseCase;
   let addressRepository: IAddressRepository;
   let logger: ILogger;

   beforeEach(async () => {
      addressRepository = createMock<IAddressRepository>({
         delete: jest.fn(),
      });

      logger = createMock<ILogger>({
         log: jest.fn(),
      });

      deleteAddressUseCase = new DeleteAddressUseCase(
         addressRepository,
         logger,
      );
   });

   it('should be defined', () => {
      expect(deleteAddressUseCase).toBeDefined();
   });

   describe('execute', () => {
      it('should delete the address and log the operation if the address exists', async () => {
         jest.spyOn(addressRepository, 'delete').mockResolvedValue(address);
         jest.spyOn(logger, 'log');

         const result = await deleteAddressUseCase.execute('1');

         expect(addressRepository.delete).toHaveBeenCalledWith('1');

         expect(logger.log).toHaveBeenCalledWith(
            'DeleteAddressUseCase execute()',
            `Address ${'1'} have been deleted`,
         );

         expect(result).toBe(address);
      });

      it('should throw a NotFoundException if the address does not exist', async () => {
         jest.spyOn(addressRepository, 'delete').mockResolvedValue(null);

         await expect(deleteAddressUseCase.execute('1')).rejects.toThrow(
            NotFoundException,
         );

         expect(addressRepository.delete).toHaveBeenCalledWith('1');
      });
   });
});
