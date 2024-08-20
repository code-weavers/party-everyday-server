import { AddressController } from '@/modules/address/address.controller';
import { AddressModule } from '@/modules/address/address.module';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
   addressPresenter,
   createAddressDTO,
   updateAddressDTO,
} from '../../mocks/address.mock';

describe('AddressController', () => {
   let controller: AddressController;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [AddressController],
         providers: [
            {
               provide: AddressModule.CREATE_ADDRESS_USECASE,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: AddressModule.UPDATE_ADDRESS_USECASE,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: AddressModule.DELETE_ADDRESS_USECASE,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
         ],
      })
         .useMocker(() => createMock())
         .compile();

      controller = module.get<AddressController>(AddressController);
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
   });

   describe('createAddress', () => {
      it('should return an instance of AddressPresenter', async () => {
         jest
            .spyOn(controller['createAddressUseCase'].getInstance(), 'execute')
            .mockResolvedValue(addressPresenter);

         const result = await controller.createAddress(createAddressDTO);

         expect(result).toEqual(addressPresenter);
      });
   });

   describe('updateAddress', () => {
      it('should return an instance of AddressPresenter', async () => {
         const id = '1';

         jest
            .spyOn(controller['updateAddressUseCase'].getInstance(), 'execute')
            .mockResolvedValue(addressPresenter);

         const result = await controller.updateAddress(id, updateAddressDTO);

         expect(result).toEqual(addressPresenter);
      });
   });

   describe('deleteAddress', () => {
      it('should return an instance of AddressPresenter', async () => {
         const id = '1';

         jest
            .spyOn(controller['deleteAddressUseCase'].getInstance(), 'execute')
            .mockResolvedValue(addressPresenter);

         const result = await controller.deleteAddress(id);

         expect(result).toEqual(addressPresenter);
      });
   });
});
